import pytest
from app.models import Announcement, AdministrativeUser

@pytest.fixture(scope="session")
def test_announcements_data(db_session):
    admin = db_session.query(AdministrativeUser).first()
    
    a1 = Announcement(title="Published 1", content="Content 1", is_published=True, posted_by=admin.id)
    a2 = Announcement(title="Published 2", content="Content 2", is_published=True, posted_by=admin.id)
    a3 = Announcement(title="Unpublished", content="Secret", is_published=False, posted_by=admin.id)
    
    db_session.add_all([a1, a2, a3])
    db_session.commit()
    return [a1, a2, a3]

def test_list_announcements_public(client, test_announcements_data):
    response = client.get("/api/announcements/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2 # Only published ones
    titles = [i["title"] for i in data["items"]]
    assert "Unpublished" not in titles

def test_get_announcement_public(client, test_announcements_data):
    pub_id = test_announcements_data[0].id
    response = client.get(f"/api/announcements/{pub_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Published 1"

def test_get_announcement_unpublished_404(client, test_announcements_data):
    unpub_id = test_announcements_data[2].id
    response = client.get(f"/api/announcements/{unpub_id}")
    assert response.status_code == 404

def test_create_announcement_unauthorized():
    from fastapi.testclient import TestClient
    from main import app
    
    old_overrides = app.dependency_overrides.copy()
    app.dependency_overrides = {} 
    
    try:
        with TestClient(app) as fresh_client:
            response = fresh_client.post(
                "/api/announcements/", 
                json={"title": "New", "content": "Body", "is_published": True}
            )
            assert response.status_code == 401
    finally:
        app.dependency_overrides = old_overrides

def test_create_announcement_authorized(client, db_session):
    response = client.post(
        "/api/announcements/", 
        json={"title": "Admin New", "content": "Body", "is_published": True}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Admin New"
    assert data["author_username"] == "admin"
    
def test_update_announcement_authorized(client, test_announcements_data):
    target_id = test_announcements_data[0].id
    response = client.put(
        f"/api/announcements/{target_id}", 
        json={"title": "Updated Title", "content": "Updated Content", "is_published": False}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"
    
def test_delete_announcement_authorized(client, test_announcements_data):
    target_id = test_announcements_data[1].id
    response = client.delete(f"/api/announcements/{target_id}")
    assert response.status_code == 204
