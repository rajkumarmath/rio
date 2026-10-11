import pytest
from app.models import AlumniProfile, Department, GraduationBatch, EmploymentHistory
from app.api.deps import get_current_admin

@pytest.fixture(scope="session")
def test_alumni_data(db_session):
    # Setup departments and batches
    dept1 = Department(name="Computer Science", code="CS")
    dept2 = Department(name="Physics", code="PHY")
    batch1 = GraduationBatch(year=2020)
    batch2 = GraduationBatch(year=2021)
    
    db_session.add_all([dept1, dept2, batch1, batch2])
    db_session.commit()
    
    # Setup Alumni Profiles
    a1 = AlumniProfile(
        first_name="Alice", last_name="Smith", email="alice@test.com", phone="12345", location="New York",
        department_id=dept1.id, batch_id=batch1.id
    )
    a2 = AlumniProfile(
        first_name="Bob", last_name="Jones", email="bob@test.com", location="London",
        department_id=dept2.id, batch_id=batch2.id
    )
    a3 = AlumniProfile(
        first_name="Charlie", last_name="Smith", email="charlie@test.com", location="New York",
        department_id=dept1.id, batch_id=batch2.id
    )
    db_session.add_all([a1, a2, a3])
    db_session.commit()
    
    # Setup Employment
    e1 = EmploymentHistory(alumni_id=a1.id, company="TechCorp", title="Software Engineer", is_current=True)
    e2 = EmploymentHistory(alumni_id=a2.id, company="ScienceInc", title="Researcher", is_current=True)
    db_session.add_all([e1, e2])
    db_session.commit()
    
    return [a1, a2, a3]

def test_list_alumni_pagination(client, test_alumni_data):
    response = client.get("/api/alumni/?page=1&size=2")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 3
    assert len(data["items"]) == 2
    assert data["pages"] >= 2
    
def test_list_alumni_search_name(client, test_alumni_data):
    response = client.get("/api/alumni/?q=smith")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2  # Alice Smith, Charlie Smith
    
def test_list_alumni_filter_department(client, test_alumni_data):
    response = client.get("/api/alumni/?department=Computer Science")
    assert response.status_code == 200
    assert len(response.json()["items"]) == 2
    
def test_list_alumni_filter_year(client, test_alumni_data):
    response = client.get("/api/alumni/?year=2021")
    assert response.status_code == 200
    assert len(response.json()["items"]) == 2 # Bob, Charlie
    
def test_list_alumni_filter_company(client, test_alumni_data):
    response = client.get("/api/alumni/?company=TechCorp")
    assert response.status_code == 200
    assert len(response.json()["items"]) == 1
    assert response.json()["items"][0]["first_name"] == "Alice"
    
def test_get_alumni_public_privacy(client, test_alumni_data):
    alice_id = test_alumni_data[0].id
    response = client.get(f"/api/alumni/{alice_id}")
    assert response.status_code == 200
    data = response.json()
    
    # Check public fields
    assert data["first_name"] == "Alice"
    assert data["last_name"] == "Smith"
    assert data["location"] == "New York"
    assert "employment_history" in data
    
    # Check privacy (no email, phone, or password hash)
    assert "email" not in data
    assert "phone" not in data
    assert "password_hash" not in data

def test_get_alumni_not_found(client):
    response = client.get("/api/alumni/9999")
    assert response.status_code == 404

def test_delete_alumni_unauthorized(test_alumni_data):
    # Create a fresh client without admin overrides
    from fastapi.testclient import TestClient
    from main import app
    
    # Save old overrides
    old_overrides = app.dependency_overrides.copy()
    
    # Remove overrides for the auth check
    app.dependency_overrides = {} 
    
    try:
        with TestClient(app) as fresh_client:
            target_id = test_alumni_data[1].id
            response = fresh_client.delete(f"/api/alumni/{target_id}")
            assert response.status_code == 401
    finally:
        # Restore overrides
        app.dependency_overrides = old_overrides

def test_delete_alumni_authorized(client, test_alumni_data, db_session):
    target_id = test_alumni_data[2].id
    # The client fixture already overrides get_current_admin
    response = client.delete(f"/api/alumni/{target_id}")
    assert response.status_code == 204
    
    # Verify deletion
    assert db_session.query(AlumniProfile).filter_by(id=target_id).first() is None
