import math
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from app.database import get_db
from app.models import AlumniProfile, Department, GraduationBatch, EmploymentHistory
from app.schemas.alumni import AlumniPaginatedResponse, AlumniPublic, AlumniProfileUpdate
from app.api.deps import get_current_admin
from app.models import AdministrativeUser

router = APIRouter()

@router.get("/", response_model=AlumniPaginatedResponse)
@router.get("", response_model=AlumniPaginatedResponse, include_in_schema=False)
def list_alumni(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: Optional[str] = None, # Search by name
    year: Optional[int] = None,
    department: Optional[str] = None,
    company: Optional[str] = None,
    designation: Optional[str] = None,
    location: Optional[str] = None,
    is_mentor: Optional[bool] = None,
    is_claimed: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AlumniProfile)

    # Filtering logic
    if q:
        search = f"%{q}%"
        query = query.filter(
            or_(
                AlumniProfile.first_name.ilike(search),
                AlumniProfile.last_name.ilike(search),
                AlumniProfile.email.ilike(search)
            )
        )
    
    if location:
        query = query.filter(AlumniProfile.location.ilike(f"%{location}%"))
        
    if year:
        query = query.join(AlumniProfile.batch).filter(GraduationBatch.year == year)
        
    if department:
        query = query.join(AlumniProfile.department).filter(Department.name.ilike(f"%{department}%"))

    if is_mentor is not None:
        query = query.filter(AlumniProfile.is_mentor == is_mentor)

    if is_claimed is not None:
        query = query.filter(AlumniProfile.is_claimed == is_claimed)
        
    if company or designation:
        query = query.join(AlumniProfile.employment_history)
        if company:
            query = query.filter(EmploymentHistory.company.ilike(f"%{company}%"))
        if designation:
            query = query.filter(EmploymentHistory.title.ilike(f"%{designation}%"))

    # Predictable sorting by ID to ensure stable pagination
    query = query.order_by(AlumniProfile.id.desc())

    total = query.count()
    pages = math.ceil(total / size) if total > 0 else 0
    
    offset = (page - 1) * size
    items = query.offset(offset).limit(size).all()

    return AlumniPaginatedResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=pages
    )

@router.get("/{alumni_id}", response_model=AlumniPublic)
def get_alumni_profile(alumni_id: int, db: Session = Depends(get_db)):
    profile = db.query(AlumniProfile).filter(AlumniProfile.id == alumni_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Alumni profile not found")
    return profile

@router.delete("/{alumni_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alumni_profile(
    alumni_id: int, 
    db: Session = Depends(get_db),
    admin: AdministrativeUser = Depends(get_current_admin)
):
    profile = db.query(AlumniProfile).filter(AlumniProfile.id == alumni_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Alumni profile not found")
    
    db.delete(profile)
    db.commit()
    return None

@router.put("/{alumni_id}/profile", response_model=AlumniPublic)
@router.put("/{alumni_id}", response_model=AlumniPublic, include_in_schema=False)
def update_alumni_profile(
    alumni_id: int,
    data: AlumniProfileUpdate,
    db: Session = Depends(get_db)
):
    profile = db.query(AlumniProfile).filter(AlumniProfile.id == alumni_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Alumni profile not found")

    if data.first_name is not None:
        profile.first_name = data.first_name
    if data.last_name is not None:
        profile.last_name = data.last_name
    if data.phone is not None:
        profile.phone = data.phone
    if data.location is not None:
        profile.location = data.location
    if data.bio is not None:
        profile.bio = data.bio
    if data.linkedin_url is not None:
        profile.linkedin_url = data.linkedin_url
    if data.avatar_url is not None:
        profile.avatar_url = data.avatar_url
    if data.is_mentor is not None:
        profile.is_mentor = data.is_mentor

    # Update or add current employment if company/title provided
    if data.company or data.title:
        curr_emp = db.query(EmploymentHistory).filter(
            EmploymentHistory.alumni_id == alumni_id,
            EmploymentHistory.is_current == True
        ).first()

        if curr_emp:
            if data.company:
                curr_emp.company = data.company
            if data.title:
                curr_emp.title = data.title
        else:
            new_emp = EmploymentHistory(
                alumni_id=alumni_id,
                company=data.company or "Current Organization",
                title=data.title or "Professional",
                is_current=True
            )
            db.add(new_emp)

    db.commit()
    db.refresh(profile)
    return profile

@router.post("/{alumni_id}/claim", response_model=AlumniPublic)
def claim_alumni_profile(
    alumni_id: int,
    data: Optional[AlumniProfileUpdate] = None,
    db: Session = Depends(get_db)
):
    profile = db.query(AlumniProfile).filter(AlumniProfile.id == alumni_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Alumni profile not found")

    profile.is_claimed = True

    if data:
        if data.first_name is not None:
            profile.first_name = data.first_name
        if data.last_name is not None:
            profile.last_name = data.last_name
        if data.phone is not None:
            profile.phone = data.phone
        if data.location is not None:
            profile.location = data.location
        if data.bio is not None:
            profile.bio = data.bio
        if data.linkedin_url is not None:
            profile.linkedin_url = data.linkedin_url
        if data.avatar_url is not None:
            profile.avatar_url = data.avatar_url
        if data.is_mentor is not None:
            profile.is_mentor = data.is_mentor

        if data.company or data.title:
            curr_emp = db.query(EmploymentHistory).filter(
                EmploymentHistory.alumni_id == alumni_id,
                EmploymentHistory.is_current == True
            ).first()

            if curr_emp:
                if data.company:
                    curr_emp.company = data.company
                if data.title:
                    curr_emp.title = data.title
            else:
                new_emp = EmploymentHistory(
                    alumni_id=alumni_id,
                    company=data.company or "Current Organization",
                    title=data.title or "Professional",
                    is_current=True
                )
                db.add(new_emp)

    db.commit()
    db.refresh(profile)
    return profile
