import math
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from app.database import get_db
from app.models import AlumniProfile, AdministrativeUser, Department, GraduationBatch
from app.schemas.admin_alumni import AlumniAdminPaginatedResponse, AlumniAdminResponse, AlumniCreateUpdate
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("/", response_model=AlumniAdminPaginatedResponse)
def list_alumni_admin(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: AdministrativeUser = Depends(get_current_admin)
):
    query = db.query(AlumniProfile)

    if q:
        search = f"%{q}%"
        query = query.filter(
            or_(
                AlumniProfile.first_name.ilike(search),
                AlumniProfile.last_name.ilike(search),
                AlumniProfile.email.ilike(search)
            )
        )
    
    query = query.order_by(AlumniProfile.id.desc())

    total = query.count()
    pages = math.ceil(total / size) if total > 0 else 0
    
    offset = (page - 1) * size
    items = query.offset(offset).limit(size).all()

    return AlumniAdminPaginatedResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=pages
    )

@router.get("/{alumni_id}", response_model=AlumniAdminResponse)
def get_alumni_admin(alumni_id: int, db: Session = Depends(get_db), admin: AdministrativeUser = Depends(get_current_admin)):
    profile = db.query(AlumniProfile).filter(AlumniProfile.id == alumni_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Alumni profile not found")
    return profile

@router.post("/", response_model=AlumniAdminResponse, status_code=status.HTTP_201_CREATED)
def create_alumni(data: AlumniCreateUpdate, db: Session = Depends(get_db), admin: AdministrativeUser = Depends(get_current_admin)):
    # Check email duplicate
    existing = db.query(AlumniProfile).filter(AlumniProfile.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    profile = AlumniProfile(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        phone=data.phone,
        location=data.location,
        bio=data.bio,
        department_id=data.department_id,
        batch_id=data.batch_id
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.put("/{alumni_id}", response_model=AlumniAdminResponse)
def update_alumni(alumni_id: int, data: AlumniCreateUpdate, db: Session = Depends(get_db), admin: AdministrativeUser = Depends(get_current_admin)):
    profile = db.query(AlumniProfile).filter(AlumniProfile.id == alumni_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Alumni profile not found")
        
    # Check email duplicate if changed
    if data.email != profile.email:
        existing = db.query(AlumniProfile).filter(AlumniProfile.email == data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
            
    profile.first_name = data.first_name
    profile.last_name = data.last_name
    profile.email = data.email
    profile.phone = data.phone
    profile.location = data.location
    profile.bio = data.bio
    profile.department_id = data.department_id
    profile.batch_id = data.batch_id
    
    db.commit()
    db.refresh(profile)
    return profile
