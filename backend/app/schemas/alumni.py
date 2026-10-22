from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class DepartmentPublic(BaseModel):
    name: str
    model_config = {"from_attributes": True}

class GraduationBatchPublic(BaseModel):
    year: int
    model_config = {"from_attributes": True}

class EmploymentHistoryPublic(BaseModel):
    company: str
    title: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool
    model_config = {"from_attributes": True}

class EducationHistoryPublic(BaseModel):
    degree: str
    field_of_study: str
    institution: str
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    model_config = {"from_attributes": True}

class AlumniPublic(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    avatar_url: Optional[str] = None
    is_claimed: Optional[bool] = False
    is_mentor: Optional[bool] = False
    location: Optional[str] = None
    bio: Optional[str] = None
    
    # We will compute these or use relationships
    department: Optional[DepartmentPublic] = None
    batch: Optional[GraduationBatchPublic] = None
    
    employment_history: List[EmploymentHistoryPublic] = []
    education_history: List[EducationHistoryPublic] = []
    model_config = {"from_attributes": True}

class AlumniProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    avatar_url: Optional[str] = None
    is_mentor: Optional[bool] = None
    company: Optional[str] = None
    title: Optional[str] = None

class AlumniPaginatedResponse(BaseModel):
    items: List[AlumniPublic]
    total: int
    page: int
    size: int
    pages: int
    model_config = {"from_attributes": True}
