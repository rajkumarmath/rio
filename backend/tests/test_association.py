import pytest

def test_get_association_info(client):
    response = client.get("/api/association/")
    assert response.status_code == 200
    data = response.json()
    assert "mission" in data
    assert "committee_members" in data
    assert len(data["committee_members"]) > 0
    assert "initiatives" in data
