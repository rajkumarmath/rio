import math
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Announcement, AdministrativeUser
from app.schemas.announcement import (
    AnnouncementPublic, 
    AnnouncementPaginatedResponse, 
    AnnouncementCreate, 
    AnnouncementUpdate
)
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("/", response_model=AnnouncementPaginatedResponse)
def list_announcements(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Only return published announcements for the public
    query = db.query(Announcement).filter(Announcement.is_published == True)
    query = query.order_by(Announcement.posted_at.desc())
    
    total = query.count()
    pages = math.ceil(total / size) if total > 0 else 0
    
    offset = (page - 1) * size
    items = query.offset(offset).limit(size).all()
    
    # Map author username for the public schema
    formatted_items = []
    for item in items:
        # Create schema instance manually to inject author username safely
        public_item = AnnouncementPublic.model_validate(item)
        public_item.author_username = item.author.username if item.author else "Admin"
        formatted_items.append(public_item)

    return AnnouncementPaginatedResponse(
        items=formatted_items,
        total=total,
        page=page,
        size=size,
        pages=pages
    )

@router.get("/{announcement_id}", response_model=AnnouncementPublic)
def get_announcement(announcement_id: int, db: Session = Depends(get_db)):
    # Only allow viewing if published
    announcement = db.query(Announcement).filter(
        Announcement.id == announcement_id,
        Announcement.is_published == True
    ).first()
    
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
        
    public_item = AnnouncementPublic.model_validate(announcement)
    public_item.author_username = announcement.author.username if announcement.author else "Admin"
    return public_item

# --- ADMIN ROUTES ---

@router.post("/", response_model=AnnouncementPublic, status_code=status.HTTP_201_CREATED)
def create_announcement(
    data: AnnouncementCreate,
    db: Session = Depends(get_db),
    admin: AdministrativeUser = Depends(get_current_admin)
):
    announcement = Announcement(
        title=data.title,
        content=data.content,
        is_published=data.is_published,
        posted_by=admin.id
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    
    public_item = AnnouncementPublic.model_validate(announcement)
    public_item.author_username = admin.username
    return public_item

@router.put("/{announcement_id}", response_model=AnnouncementPublic)
def update_announcement(
    announcement_id: int,
    data: AnnouncementUpdate,
    db: Session = Depends(get_db),
    admin: AdministrativeUser = Depends(get_current_admin)
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
        
    announcement.title = data.title
    announcement.content = data.content
    announcement.is_published = data.is_published
    
    db.commit()
    db.refresh(announcement)
    
    public_item = AnnouncementPublic.model_validate(announcement)
    public_item.author_username = announcement.author.username if announcement.author else "Admin"
    return public_item

@router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    admin: AdministrativeUser = Depends(get_current_admin)
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
        
    db.delete(announcement)
    db.commit()
    return None
