from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AnnouncementBase(BaseModel):
    title: str
    content: str
    is_published: bool = True

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementUpdate(AnnouncementBase):
    pass

class AnnouncementPublic(BaseModel):
    id: int
    title: str
    content: str
    posted_at: datetime
    is_published: bool
    
    # We can expose a safe string for author, e.g. "Admin" or username, but no emails/IDs
    author_username: Optional[str] = None

    model_config = {"from_attributes": True}

class AnnouncementPaginatedResponse(BaseModel):
    items: List[AnnouncementPublic]
    total: int
    page: int
    size: int
    pages: int
    model_config = {"from_attributes": True}
