import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import subprocess

from app.database import Base

# This test requires a disposable PostgreSQL database specifically for testing.
# Never use a production database URL here.
# Example: postgresql://postgres:password@localhost:5432/test_alumnidb
TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")

@pytest.mark.skipif(not TEST_DATABASE_URL, reason="TEST_DATABASE_URL not provided.")
def test_postgresql_migration_and_models():
    """
    Verifies that Alembic migrations run successfully against a real PostgreSQL instance,
    and that SQLAlchemy models correctly map without dialect-specific errors.
    """
    # 1. Run Alembic upgrade head against the test DB
    # We pass the URL via environment variable to alembic
    env = os.environ.copy()
    env["DATABASE_URL"] = TEST_DATABASE_URL
    
    result = subprocess.run(
        ["alembic", "upgrade", "head"],
        env=env,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Alembic upgrade failed:\n{result.stderr}"

    # 2. Connect via SQLAlchemy and test a basic transaction
    engine = create_engine(TEST_DATABASE_URL)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    db = TestingSessionLocal()
    try:
        from app.models import Department
        # Test basic insert and query
        new_dept = Department(name="Integration Test Dept", code="ITD")
        db.add(new_dept)
        db.commit()
        
        dept = db.query(Department).filter_by(code="ITD").first()
        assert dept is not None
        assert dept.name == "Integration Test Dept"
        
        # Cleanup
        db.delete(dept)
        db.commit()
    finally:
        db.close()
        
    # 3. Clean up the schema by downgrading entirely (teardown)
    teardown_result = subprocess.run(
        ["alembic", "downgrade", "base"],
        env=env,
        capture_output=True,
        text=True
    )
    assert teardown_result.returncode == 0, f"Alembic downgrade failed:\n{teardown_result.stderr}"
