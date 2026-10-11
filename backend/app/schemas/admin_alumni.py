from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.schemas.alumni import DepartmentPublic, GraduationBatchPublic, EmploymentHistoryPublic, EducationHistoryPublic

# For creating or updating Alumni
class AlumniCreateUpdate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    
    # Simple IDs for relationships for now
    department_id: Optional[int] = None
    batch_id: Optional[int] = None

class AlumniAdminResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    
    department: Optional[DepartmentPublic] = None
    batch: Optional[GraduationBatchPublic] = None
    
    employment_history: List[EmploymentHistoryPublic] = []
    education_history: List[EducationHistoryPublic] = []
    
    model_config = {"from_attributes": True}

class AlumniAdminPaginatedResponse(BaseModel):
    items: List[AlumniAdminResponse]
    total: int
    page: int
    size: int
    pages: int
    model_config = {"from_attributes": True}
