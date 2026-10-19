import os
import argparse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import AdministrativeUser
from app.core.security import get_password_hash
from app.core.config import settings
import getpass

def main():
    parser = argparse.ArgumentParser(description="Create the first admin account.")
    parser.add_argument("--username", required=True, help="Admin username")
    parser.add_argument("--email", required=True, help="Admin email")
    parser.add_argument("--password", required=False, help="Admin password (optional, prompted if omitted)")
    args = parser.parse_args()

    if args.password:
        password = args.password
    else:
        password = getpass.getpass(f"Enter password for {args.username}: ")
        confirm_password = getpass.getpass("Confirm password: ")

        if password != confirm_password:
            print("Passwords do not match!")
            return

    # Check if DATABASE_URL is set in environment, otherwise fallback to settings
    db_url = os.environ.get("DATABASE_URL", settings.DATABASE_URL)
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    db = SessionLocal()
    try:
        existing = db.query(AdministrativeUser).filter((AdministrativeUser.username == args.username) | (AdministrativeUser.email == args.email)).first()
        if existing:
            print(f"Admin user '{args.username}' or '{args.email}' already exists.")
            return

        hashed_pw = get_password_hash(password)
        new_admin = AdministrativeUser(
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
