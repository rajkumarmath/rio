import uuid
import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_admin, get_db
from app.models import AdministrativeUser
from app.schemas.importer import PreviewResponse, ImportRequest, ImportResponse
from app.services.importer import process_file_preview, perform_import, UPLOAD_DIR

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/preview", response_model=PreviewResponse)
async def preview_import(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: AdministrativeUser = Depends(get_current_admin)
):
    if not file.filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Invalid file format. Only CSV and Excel are supported.")
        
    file_content = bytearray()
    while chunk := await file.read(1024 * 1024):  # Read in 1MB chunks
        file_content.extend(chunk)
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
        
    # Generate a unique temp ID
    file_id = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_id)
    
    with open(file_path, "wb") as f:
        f.write(file_content)
        
    try:
        response = process_file_preview(file_path, db)
        return response
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Error parsing file: {str(e)}")

@router.post("/import", response_model=ImportResponse)
def execute_import(
    request: ImportRequest,
    db: Session = Depends(get_db),
    admin: AdministrativeUser = Depends(get_current_admin)
):
    try:
        response = perform_import(request.file_id, request.mapping, db)
        return response
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during import: {str(e)}")
