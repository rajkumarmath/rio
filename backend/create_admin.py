import os
import argparse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import AdminUser
from app.core.security import get_password_hash
from app.core.config import settings
import getpass

def main():
    parser = argparse.ArgumentParser(description="Create the first admin account.")
    parser.add_argument("--username", required=True, help="Admin username")
    parser.add_argument("--email", required=True, help="Admin email")
    args = parser.parse_args()

    password = getpass.getpass(f"Enter password for {args.username}: ")
    confirm_password = getpass.getpass("Confirm password: ")

    if password != confirm_password:
        print("Passwords do not match!")
        return

    # Check if DATABASE_URL is set in environment, otherwise fallback to settings
    db_url = os.environ.get("DATABASE_URL", settings.DATABASE_URL)
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter((AdminUser.username == args.username) | (AdminUser.email == args.email)).first()
        if existing:
            print("Admin user with this username or email already exists.")
            return

        hashed_pw = get_password_hash(password)
        new_admin = AdminUser(
            username=args.username,
            email=args.email,
            password_hash=hashed_pw
        )
        db.add(new_admin)
        db.commit()
        print(f"Successfully created admin user: {args.username}")
    except Exception as e:
        print(f"Failed to create admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
