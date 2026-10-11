import pandas as pd
import uuid
import os
import re
from typing import Dict, Any, List, Tuple
from pydantic import EmailStr, validate_email
from sqlalchemy.orm import Session
from app.models import AlumniProfile, Department, GraduationBatch
from app.schemas.importer import ColumnMapping, PreviewRow, PreviewResponse, ImportResponse

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def suggest_mapping(headers: List[str]) -> ColumnMapping:
    mapping = ColumnMapping()
    for h in headers:
        hl = h.lower().strip()
        if not mapping.first_name and re.search(r"first.*name", hl):
            mapping.first_name = h
        elif not mapping.last_name and re.search(r"last.*name", hl):
            mapping.last_name = h
        elif not mapping.email and "email" in hl:
            mapping.email = h
        elif not mapping.phone and ("phone" in hl or "mobile" in hl):
            mapping.phone = h
        elif not mapping.department_name and ("department" in hl or "dept" in hl or "course" in hl):
            mapping.department_name = h
        elif not mapping.graduation_year and ("year" in hl or "batch" in hl or "grad" in hl):
            mapping.graduation_year = h
        elif not mapping.location and ("location" in hl or "city" in hl):
            mapping.location = h
    return mapping

def validate_and_parse_df(df: pd.DataFrame, mapping: ColumnMapping, db: Session) -> Tuple[List[PreviewRow], int, int, int]:
    rows = []
    valid_count = 0
    invalid_count = 0
    duplicate_count = 0

    # Cache existing emails for exact duplicate detection
    existing_emails = {email[0] for email in db.query(AlumniProfile.email).all()}
    
    # Cache existing name+batch combinations for possible match detection
    existing_alumni = db.query(AlumniProfile.first_name, AlumniProfile.last_name, AlumniProfile.batch_id).all()
    
    # Pre-fetch batch years to match IDs
    batch_map = {b.id: b.year for b in db.query(GraduationBatch).all()}
    
    existing_fuzzy = set()
    for fname, lname, batch_id in existing_alumni:
        if fname and lname and batch_id in batch_map:
            fuzzy_key = f"{fname.lower().strip()}_{lname.lower().strip()}_{batch_map[batch_id]}"
            existing_fuzzy.add(fuzzy_key)

    for index, row in df.iterrows():
        errors = []
        is_duplicate = False
        possible_match = False

        # Extract mapped data
        data = row.to_dict()
        
        email = str(data.get(mapping.email, "")).strip() if mapping.email else ""
        first_name = str(data.get(mapping.first_name, "")).strip() if mapping.first_name else ""
        last_name = str(data.get(mapping.last_name, "")).strip() if mapping.last_name else ""
        year_str = str(data.get(mapping.graduation_year, "")).strip() if mapping.graduation_year else ""
        
        # Validation
        if not first_name or str(first_name).lower() == "nan":
            errors.append("Missing first name")
        if not last_name or str(last_name).lower() == "nan":
            errors.append("Missing last name")
            
        if not email or str(email).lower() == "nan":
            errors.append("Missing email")
        else:
            try:
                # Basic email validation
                if "@" not in email or "." not in email:
                    raise ValueError
            except ValueError:
                errors.append("Invalid email format")

        if year_str and str(year_str).lower() != "nan":
            try:
                year = int(float(year_str))
                if year < 1900 or year > 2100:
                    errors.append("Invalid graduation year")
            except ValueError:
                errors.append("Graduation year must be a number")

        # Duplicate detection
        fuzzy_key = None
        if first_name and last_name and year_str and year_str.lower() != "nan":
            try:
                y = int(float(year_str))
                fuzzy_key = f"{first_name.lower()}_{last_name.lower()}_{y}"
            except ValueError:
                pass
                
        if email in existing_emails:
            is_duplicate = True
            errors.append("Exact duplicate found (email exists)")
        elif fuzzy_key and fuzzy_key in existing_fuzzy:
            possible_match = True
            errors.append("Possible match found (same name and graduation year)")
        
        # If no exact email match, try fuzzy matching name + year (omitted for brevity, could query DB)
        
        is_valid = len(errors) == 0

        if is_valid and not is_duplicate:
            valid_count += 1
            if email:
                existing_emails.add(email)
        elif is_duplicate:
            duplicate_count += 1
        else:
            invalid_count += 1

        rows.append(PreviewRow(
            row_index=index + 1,
            data=data,
            is_valid=is_valid,
            errors=errors,
            is_duplicate=is_duplicate,
            possible_match=possible_match
        ))
        
    return rows, valid_count, invalid_count, duplicate_count

def process_file_preview(file_path: str, db: Session) -> PreviewResponse:
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    # Normalize NaN to None or empty string
    df = df.fillna("")

    headers = df.columns.tolist()
    suggested_mapping = suggest_mapping(headers)
    
    rows, valid, invalid, duplicate = validate_and_parse_df(df, suggested_mapping, db)
    
    file_id = os.path.basename(file_path)
    
    return PreviewResponse(
        headers=headers,
        suggested_mapping=suggested_mapping,
        rows=rows,
        total_rows=len(rows),
        valid_rows=valid,
        invalid_rows=invalid,
        duplicate_rows=duplicate,
        file_id=file_id
    )

def perform_import(file_id: str, mapping: ColumnMapping, db: Session) -> ImportResponse:
    file_path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(file_path):
        raise FileNotFoundError("Import file not found or expired.")
        
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)
        
    df = df.fillna("")
    
    # We validate again strictly during import
    rows, _, _, _ = validate_and_parse_df(df, mapping, db)
    
    inserted = 0
    skipped = 0
    failed = 0
    
    # Fetch/create caches
    dept_cache = {}
    batch_cache = {}
    
    for dept in db.query(Department).all():
        dept_cache[dept.name.lower()] = dept
        
    for batch in db.query(GraduationBatch).all():
        batch_cache[batch.year] = batch

    try:
        with db.begin_nested(): # Transaction savepoint
            for row in rows:
                if row.is_duplicate:
                    skipped += 1
                    continue
                if not row.is_valid:
                    failed += 1
                    continue
                    
                data = row.data
                
                # Retrieve fields
                email = str(data.get(mapping.email, "")).strip()
                first_name = str(data.get(mapping.first_name, "")).strip()
                last_name = str(data.get(mapping.last_name, "")).strip()
                phone = str(data.get(mapping.phone, "")).strip() if mapping.phone else None
                location = str(data.get(mapping.location, "")).strip() if mapping.location else None
                bio = str(data.get(mapping.bio, "")).strip() if mapping.bio else None
                
                # Handle Department
                dept_id = None
                if mapping.department_name:
                    dept_name = str(data.get(mapping.department_name, "")).strip()
                    if dept_name:
                        dept_key = dept_name.lower()
                        if dept_key not in dept_cache:
                            new_dept = Department(name=dept_name, code=dept_name[:10].upper())
                            db.add(new_dept)
                            db.flush()
                            dept_cache[dept_key] = new_dept
                        dept_id = dept_cache[dept_key].id
                
                # Handle Batch
                batch_id = None
                if mapping.graduation_year:
                    year_str = str(data.get(mapping.graduation_year, "")).strip()
                    if year_str:
                        year = int(float(year_str))
                        if year not in batch_cache:
                            new_batch = GraduationBatch(year=year)
                            db.add(new_batch)
                            db.flush()
                            batch_cache[year] = new_batch
                        batch_id = batch_cache[year].id
                
                profile = AlumniProfile(
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    phone=phone,
                    location=location,
                    bio=bio,
                    department_id=dept_id,
                    batch_id=batch_id
                )
                db.add(profile)
                inserted += 1
                
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        # Cleanup file after processing to ensure no permanent storage
        if os.path.exists(file_path):
            os.remove(file_path)

    return ImportResponse(
        total_processed=len(rows),
        inserted=inserted,
        skipped=skipped,
        failed=failed
    )
