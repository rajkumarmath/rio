import sys
import os
from datetime import date, datetime

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import (
    AdministrativeUser,
    Department,
    GraduationBatch,
    AlumniProfile,
    EducationHistory,
    EmploymentHistory,
    Announcement,
)
from app.core.security import get_password_hash

def seed_data():
    db = SessionLocal()
    try:
        print("Ensuring database tables exist...")
        Base.metadata.create_all(bind=engine)

        # 1. Departments
        dept_data = [
            ("School of Computing & Information Technology", "SCIT"),
            ("School of Electronics & Communication Engineering", "SECE"),
            ("School of Mechanical Engineering", "SME"),
            ("School of Civil Engineering", "SCE"),
            ("School of Management Studies", "SMS"),
        ]
        dept_map = {}
        for name, code in dept_data:
            dept = db.query(Department).filter(Department.code == code).first()
            if not dept:
                dept = Department(name=name, code=code)
                db.add(dept)
                db.flush()
                print(f"Created Department: {name}")
            dept_map[code] = dept

        # 2. Batches
        batch_years = [2018, 2019, 2020, 2021, 2022, 2023, 2024]
        batch_map = {}
        for yr in batch_years:
            b = db.query(GraduationBatch).filter(GraduationBatch.year == yr).first()
            if not b:
                b = GraduationBatch(year=yr)
                db.add(b)
                db.flush()
                print(f"Created Batch: {yr}")
            batch_map[yr] = b

        # 3. Admin user if needed
        admin = db.query(AdministrativeUser).first()
        if not admin:
            admin = AdministrativeUser(
                username="admin",
                email="admin@reva.edu.in",
                password_hash=get_password_hash("AdminPass123!"),
            )
            db.add(admin)
            db.flush()
            print("Created Admin user: admin / AdminPass123!")

        # 4. Announcements
        announcements_data = [
            (
                "REVA Global Alumni Meet 2026 Announced!",
                "We are thrilled to welcome all alumni back to Rukmini Knowledge Park for our flagship Annual Alumni Reunion on December 18-19, 2026. Register your attendance now through AlumniSphere.",
            ),
            (
                "Mentorship Program Kickoff for Class of 2027",
                "Calling all alumni industry experts! Connect with current engineering and management scholars through the REVA Alumni Mentorship Initiative. Fill out your mentor profile today.",
            ),
            (
                "REVA Innovation and Incubation Centre Grants",
                "The REVA University Incubation Centre is offering seed funding for startup ventures founded by REVA alumni. Check the association resources page for eligibility criteria.",
            ),
        ]
        for title, content in announcements_data:
            existing = db.query(Announcement).filter(Announcement.title == title).first()
            if not existing:
                ann = Announcement(
                    title=title,
                    content=content,
                    posted_by=admin.id,
                    is_published=True,
                )
                db.add(ann)
                print(f"Created Announcement: {title}")

        # 5. Alumni Profiles
        alumni_list = [
            {
                "first_name": "Aarav",
                "last_name": "Sharma",
                "email": "aarav.sharma@example.com",
                "phone": "+91 98765 43210",
                "location": "Bengaluru, Karnataka, India",
                "bio": "Senior Cloud Infrastructure Engineer specializing in Kubernetes, AWS, and resilient microservices. Active mentor for REVA University engineering students.",
                "linkedin_url": "https://www.linkedin.com/in/aarav-sharma-cloud",
                "dept": "SCIT",
                "batch": 2022,
                "employment": [
                    {
                        "title": "Senior Cloud Engineer",
                        "company": "Amazon Web Services (AWS)",
                        "start_date": date(2022, 7, 1),
                        "end_date": None,
                        "is_current": True,
                    },
                    {
                        "title": "Cloud Solutions Intern",
                        "company": "Infosys",
                        "start_date": date(2021, 8, 1),
                        "end_date": date(2022, 6, 30),
                        "is_current": False,
                    },
                ],
                "education": [
                    {
                        "institution": "REVA University",
                        "degree": "B.Tech",
                        "field_of_study": "Computer Science & Engineering",
                        "start_year": 2018,
                        "end_year": 2022,
                    }
                ],
            },
            {
                "first_name": "Priya",
                "last_name": "Venkatesh",
                "email": "priya.venkatesh@example.com",
                "phone": "+91 98450 12345",
                "location": "Munich, Germany",
                "bio": "Embedded Systems Architect working on autonomous vehicle perception and automotive safety electronics at Robert Bosch.",
                "linkedin_url": "https://www.linkedin.com/in/priya-venkatesh-embedded",
                "dept": "SECE",
                "batch": 2020,
                "employment": [
                    {
                        "title": "Lead Firmware Architect",
                        "company": "Robert Bosch GmbH",
                        "start_date": date(2020, 9, 1),
                        "end_date": None,
                        "is_current": True,
                    }
                ],
                "education": [
                    {
                        "institution": "REVA University",
                        "degree": "B.Tech",
                        "field_of_study": "Electronics & Communication Engineering",
                        "start_year": 2016,
                        "end_year": 2020,
                    }
                ],
            },
            {
                "first_name": "Rohan",
                "last_name": "Deshmukh",
                "email": "rohan.deshmukh@example.com",
                "phone": "+91 97312 99881",
                "location": "Mumbai, Maharashtra, India",
                "bio": "Fintech Product Lead overseeing high-volume merchant payment infrastructure. Enthusiastic about student-led startup ventures.",
                "linkedin_url": "https://www.linkedin.com/in/rohan-deshmukh-fintech",
                "dept": "SMS",
                "batch": 2021,
                "employment": [
                    {
                        "title": "Senior Product Manager",
                        "company": "Razorpay",
                        "start_date": date(2021, 6, 1),
                        "end_date": None,
                        "is_current": True,
                    }
                ],
                "education": [
                    {
                        "institution": "REVA University",
                        "degree": "MBA",
                        "field_of_study": "Marketing & Analytics",
                        "start_year": 2019,
                        "end_year": 2021,
                    }
                ],
            },
            {
                "first_name": "Ananya",
                "last_name": "Hegde",
                "email": "ananya.hegde@example.com",
                "phone": "+91 99001 55432",
                "location": "Seattle, Washington, USA",
                "bio": "Machine Learning Engineer focusing on generative AI platforms, model alignment, and intelligent search systems.",
                "linkedin_url": "https://www.linkedin.com/in/ananya-hegde-ai",
                "dept": "SCIT",
                "batch": 2023,
                "employment": [
                    {
                        "title": "Machine Learning Engineer",
                        "company": "Microsoft",
                        "start_date": date(2023, 8, 1),
                        "end_date": None,
                        "is_current": True,
                    }
                ],
                "education": [
                    {
                        "institution": "REVA University",
                        "degree": "B.Tech",
                        "field_of_study": "Artificial Intelligence & Data Science",
                        "start_year": 2019,
                        "end_year": 2023,
                    }
                ],
            },
            {
                "first_name": "Karthik",
                "last_name": "Nambiar",
                "email": "karthik.nambiar@example.com",
                "phone": "+91 98860 67890",
                "location": "Hyderabad, Telangana, India",
                "bio": "Robotics automation lead with extensive expertise in clean energy manufacturing systems and industrial robotics.",
                "linkedin_url": "https://www.linkedin.com/in/karthik-nambiar-robotics",
                "dept": "SME",
                "batch": 2019,
                "employment": [
                    {
                        "title": "Principal Automation Engineer",
                        "company": "Tesla Energy",
                        "start_date": date(2019, 7, 1),
                        "end_date": None,
                        "is_current": True,
                    }
                ],
                "education": [
                    {
                        "institution": "REVA University",
                        "degree": "B.Tech",
                        "field_of_study": "Mechanical Engineering",
                        "start_year": 2015,
                        "end_year": 2019,
                    }
                ],
            },
            {
                "first_name": "Sneha",
                "last_name": "Kulkarni",
                "email": "sneha.kulkarni@example.com",
                "phone": "+91 94480 33211",
                "location": "Dubai, United Arab Emirates",
                "bio": "Structural Engineering Specialist designing sustainable mega-infrastructure and low-carbon urban transit networks.",
                "linkedin_url": "https://www.linkedin.com/in/sneha-kulkarni-structural",
                "dept": "SCE",
                "batch": 2021,
                "employment": [
                    {
                        "title": "Senior Structural Consultant",
                        "company": "AtkinsRéalis",
                        "start_date": date(2021, 9, 1),
                        "end_date": None,
                        "is_current": True,
                    }
                ],
                "education": [
                    {
                        "institution": "REVA University",
                        "degree": "B.Tech",
                        "field_of_study": "Civil Engineering",
                        "start_year": 2017,
                        "end_year": 2021,
                    }
                ],
            },
        ]

        for item in alumni_list:
            existing = db.query(AlumniProfile).filter(AlumniProfile.email == item["email"]).first()
            if not existing:
                profile = AlumniProfile(
                    first_name=item["first_name"],
                    last_name=item["last_name"],
                    email=item["email"],
                    phone=item["phone"],
                    location=item["location"],
                    bio=item["bio"],
                    linkedin_url=item.get("linkedin_url"),
                    department_id=dept_map[item["dept"]].id,
                    batch_id=batch_map[item["batch"]].id,
                )
                db.add(profile)
                db.flush()

                for emp in item["employment"]:
                    job = EmploymentHistory(
                        alumni_id=profile.id,
                        company=emp["company"],
                        title=emp["title"],
                        start_date=emp["start_date"],
                        end_date=emp["end_date"],
                        is_current=emp["is_current"],
                    )
                    db.add(job)

                for edu in item["education"]:
                    school = EducationHistory(
                        alumni_id=profile.id,
                        institution=edu["institution"],
                        degree=edu["degree"],
                        field_of_study=edu["field_of_study"],
                        start_year=edu["start_year"],
                        end_year=edu["end_year"],
                    )
                    db.add(school)

                print(f"Seeded Alumni: {profile.first_name} {profile.last_name}")
            else:
                if item.get("linkedin_url") and not existing.linkedin_url:
                    existing.linkedin_url = item.get("linkedin_url")
                    print(f"Updated LinkedIn for: {existing.first_name} {existing.last_name}")

        db.commit()
        print("Data seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
