import math
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from app.database import get_db
from app.models import AlumniProfile, Department, GraduationBatch, EmploymentHistory
from app.schemas.alumni import AlumniPaginatedResponse, AlumniPublic
from app.api.deps import get_current_admin
from app.models import AdministrativeUser

router = APIRouter()

@router.get("/", response_model=AlumniPaginatedResponse)
def list_alumni(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: Optional[str] = None, # Search by name
    year: Optional[int] = None,
    department: Optional[str] = None,
    company: Optional[str] = None,
    designation: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AlumniProfile)

    # Filtering logic
    if q:
        search = f"%{q}%"
        query = query.filter(
            or_(
                AlumniProfile.first_name.ilike(search),
                AlumniProfile.last_name.ilike(search)
            )
        )
    
    if location:
        query = query.filter(AlumniProfile.location.ilike(f"%{location}%"))
        
    if year:
        query = query.join(AlumniProfile.batch).filter(GraduationBatch.year == year)
        
    if department:
        query = query.join(AlumniProfile.department).filter(Department.name.ilike(f"%{department}%"))
        
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
