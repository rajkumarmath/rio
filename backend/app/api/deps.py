from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database import get_db
from app.models import AdministrativeUser, AlumniProfile

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/token", auto_error=False)

def get_current_admin(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> AdministrativeUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise credentials_exception
        
    admin = db.query(AdministrativeUser).filter(AdministrativeUser.id == int(user_id)).first()
    if admin is None:
        raise credentials_exception
    return admin

def verify_alumni_or_admin(
    alumni_id: int,
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Enforces strict access control:
    Only the verified alumni matching alumni_id, or an authorized administrator,
    can modify this alumni profile.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in with your registered university email.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        sub: str = str(payload.get("sub", ""))
        if not sub:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired. Please sign in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    # Check if Alumni token: 'alumni:{id}'
    if sub.startswith("alumni:"):
        try:
            token_alumni_id = int(sub.split(":")[1])
        except (ValueError, IndexError):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed alumni token")
        
        if token_alumni_id != alumni_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You are only authorized to modify your own alumni profile."
            )
        alumnus = db.query(AlumniProfile).filter(AlumniProfile.id == token_alumni_id).first()
        if not alumnus:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alumni profile not found")
        return {"role": "alumni", "user": alumnus}

    # Check if Admin token: sub is admin user ID
    try:
        admin_id = int(sub)
        admin = db.query(AdministrativeUser).filter(AdministrativeUser.id == admin_id).first()
        if admin:
            return {"role": "admin", "user": admin}
    except ValueError:
        pass

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access")

