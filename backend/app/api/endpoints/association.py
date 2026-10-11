import json
import os
from fastapi import APIRouter, HTTPException
from app.schemas.association import AssociationInfo

router = APIRouter()

# Construct path relative to this file to ensure it works from any CWD
current_dir = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(current_dir, "..", "..", "data", "association_info.json")

@router.get("/", response_model=AssociationInfo)
def get_association_info():
    if not os.path.exists(DATA_FILE):
        raise HTTPException(status_code=404, detail="Association information not configured.")
        
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        return AssociationInfo(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error reading association information.")
