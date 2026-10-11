import pytest
import time
from datetime import datetime, timedelta, timezone
import jwt
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings

def test_password_hashing():
    password = "supersecretadmin123"
    hashed = get_password_hash(password)
    
    assert password != hashed
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False

def test_create_access_token():
    user_id = 42
    token = create_access_token(user_id)
    
    # decode the token manually
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    
    assert payload["sub"] == str(user_id)
    assert "exp" in payload
    
    # Ensure expiration is in the future
    exp_time = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    assert exp_time > datetime.now(timezone.utc)
