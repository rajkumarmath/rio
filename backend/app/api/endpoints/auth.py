from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models import AdministrativeUser, AlumniProfile
from app.core.security import verify_password, create_access_token, get_password_hash

router = APIRouter()

@router.post("/token")
async def login_for_access_token(
    request: Request,
    db: Session = Depends(get_db)
):
    content_type = request.headers.get("content-type", "")
    username = None
    password = None

    if "application/json" in content_type:
        try:
            body = await request.json()
            username = body.get("username")
            password = body.get("password")
        except Exception:
            pass
    else:
        try:
            form = await request.form()
            username = form.get("username")
            password = form.get("password")
        except Exception:
            pass

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required"
        )

    # Allow login with either username or email
    admin = db.query(AdministrativeUser).filter(
        or_(
            AdministrativeUser.username == username,
            AdministrativeUser.email == username
        )
    ).first()

    if not admin or not verify_password(password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=admin.id)
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/alumni/login")
async def login_alumni(
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        body = await request.json()
    except Exception:
        body = {}
    
    email = (body.get("email") or "").strip().lower()
    password = (body.get("password") or "").strip()

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    alumnus = db.query(AlumniProfile).filter(AlumniProfile.email.ilike(email)).first()
    if not alumnus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No alumni registered with this email address. Please check your spelling or contact alumni office."
        )

    # First time activation: if no password_hash exists yet, set it!
    if not alumnus.password_hash:
        alumnus.password_hash = get_password_hash(password)
        alumnus.is_claimed = True
        db.commit()
    else:
        if not verify_password(password, alumnus.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password for this alumni account"
            )

    token = create_access_token(subject=f"alumni:{alumnus.id}")
    return {
        "access_token": token,
        "token_type": "bearer",
        "alumni_id": alumnus.id,
        "first_name": alumnus.first_name,
        "last_name": alumnus.last_name,
        "email": alumnus.email
    }
