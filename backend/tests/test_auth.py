import pytest
from app.models import AdministrativeUser
from app.core.security import get_password_hash

def test_login_success_username(client, db_session):
    # Ensure admin exists
    admin = db_session.query(AdministrativeUser).filter(AdministrativeUser.username == "testadmin").first()
    if not admin:
        admin = AdministrativeUser(
            username="testadmin",
            email="testadmin@reva.edu.in",
            password_hash=get_password_hash("TestPass123!"),
        )
        db_session.add(admin)
        db_session.commit()

    response = client.post(
        "/api/auth/token",
        data={"username": "testadmin", "password": "TestPass123!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_success_email(client, db_session):
    response = client.post(
        "/api/auth/token",
        data={"username": "testadmin@reva.edu.in", "password": "TestPass123!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_login_invalid_password(client, db_session):
    response = client.post(
        "/api/auth/token",
        data={"username": "testadmin", "password": "WrongPassword"}
    )
    assert response.status_code == 401

def test_login_nonexistent_user(client, db_session):
    response = client.post(
        "/api/auth/token",
        data={"username": "nonexistent_admin", "password": "SomePassword"}
    )
    assert response.status_code == 401

def test_login_missing_fields(client, db_session):
    response = client.post(
        "/api/auth/token",
        data={"username": "testadmin"}
    )
    assert response.status_code == 400
