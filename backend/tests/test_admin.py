import pytest
from app.models import AlumniProfile, AdministrativeUser

def test_get_admin_stats_unauthorized():
    from fastapi.testclient import TestClient
    from main import app
    
    old_overrides = app.dependency_overrides.copy()
    app.dependency_overrides = {} 
    
    try:
        with TestClient(app) as fresh_client:
            response = fresh_client.get("/api/admin/stats/")
            assert response.status_code == 401
    finally:
        app.dependency_overrides = old_overrides

def test_get_admin_stats_authorized(client, db_session):
    response = client.get("/api/admin/stats/")
    assert response.status_code == 200
    data = response.json()
    assert "alumni_count" in data
    assert "departments_count" in data
    assert "batches_count" in data
    assert "announcements_count" in data

def test_list_admin_alumni_authorized(client, db_session):
    response = client.get("/api/admin/alumni/")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data

def test_create_admin_alumni_authorized(client, db_session):
    payload = {
        "first_name": "Test",
        "last_name": "AdminCreation",
        "email": "admincreation@example.com",
        "phone": "1234567890",
        "location": "Test City",
        "bio": "Test bio"
    }
    response = client.post("/api/admin/alumni/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "admincreation@example.com"
    assert "phone" in data

def test_update_admin_alumni_authorized(client, db_session):
    # First create
    payload = {
        "first_name": "Test",
        "last_name": "AdminUpdate",
        "email": "adminupdate@example.com",
        "phone": "1234567890"
    }
    create_response = client.post("/api/admin/alumni/", json=payload)
    assert create_response.status_code == 201
    alumni_id = create_response.json()["id"]

    # Then update
    update_payload = payload.copy()
    update_payload["last_name"] = "UpdatedName"
    response = client.put(f"/api/admin/alumni/{alumni_id}", json=update_payload)
    
    assert response.status_code == 200
    assert response.json()["last_name"] == "UpdatedName"
