from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any, Optional

class ColumnMapping(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    department_name: Optional[str] = None
    graduation_year: Optional[str] = None

class PreviewRow(BaseModel):
    row_index: int
    data: Dict[str, Any]
    is_valid: bool
    errors: List[str]
    is_duplicate: bool
    possible_match: bool

class PreviewResponse(BaseModel):
    headers: List[str]
    suggested_mapping: ColumnMapping
    rows: List[PreviewRow]
    total_rows: int
    valid_rows: int
    invalid_rows: int
    duplicate_rows: int
    file_id: str  # For tracking the temp file during the session

class ImportRequest(BaseModel):
    file_id: str
    mapping: ColumnMapping

class ImportResponse(BaseModel):
    total_processed: int
    inserted: int
    skipped: int
    failed: int
