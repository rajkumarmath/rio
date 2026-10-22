from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database import get_db
from app.models import AdministrativeUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

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
