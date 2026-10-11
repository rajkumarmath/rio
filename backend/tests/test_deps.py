import pytest
from fastapi import HTTPException
from app.api.deps import get_current_admin
from app.models import AdministrativeUser
from app.core.config import settings
import jwt
from datetime import datetime, timedelta, timezone

class MockQuery:
    def __init__(self, admin):
        self.admin = admin
        
    def filter(self, *args, **kwargs):
        return self
        
    def first(self):
        return self.admin

class MockDb:
    def __init__(self, admin=None):
        self.admin = admin
        
    def query(self, *args, **kwargs):
        return MockQuery(self.admin)

def test_get_current_admin_valid():
    admin = AdministrativeUser(id=1, username="admin1")
    db = MockDb(admin)
    
    # Create valid token
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode = {"exp": expire, "sub": "1"}
    token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    current_admin = get_current_admin(token=token, db=db)
    assert current_admin.id == 1
    assert current_admin.username == "admin1"

def test_get_current_admin_expired_token():
    admin = AdministrativeUser(id=1, username="admin1")
    db = MockDb(admin)
    
    # Create expired token
    expire = datetime.now(timezone.utc) - timedelta(minutes=15)
    to_encode = {"exp": expire, "sub": "1"}
    token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    with pytest.raises(HTTPException) as excinfo:
        get_current_admin(token=token, db=db)
    
    assert excinfo.value.status_code == 401
    assert "expired" in excinfo.value.detail.lower()

def test_get_current_admin_invalid_token():
    db = MockDb()
    with pytest.raises(HTTPException) as excinfo:
        get_current_admin(token="invalid.token.str", db=db)
    assert excinfo.value.status_code == 401

def test_get_current_admin_user_not_found():
    db = MockDb(admin=None)
    
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode = {"exp": expire, "sub": "999"}
    token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    with pytest.raises(HTTPException) as excinfo:
        get_current_admin(token=token, db=db)
    
    assert excinfo.value.status_code == 401
