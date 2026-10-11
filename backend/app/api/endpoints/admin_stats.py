from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AlumniProfile, Department, GraduationBatch, Announcement, AdministrativeUser
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("/")
def get_admin_stats(db: Session = Depends(get_db), admin: AdministrativeUser = Depends(get_current_admin)):
    alumni_count = db.query(AlumniProfile).count()
    departments_count = db.query(Department).count()
    batches_count = db.query(GraduationBatch).count()
    announcements_count = db.query(Announcement).filter(Announcement.is_published == True).count()
    
    return {
        "alumni_count": alumni_count,
        "departments_count": departments_count,
        "batches_count": batches_count,
        "announcements_count": announcements_count
    }
