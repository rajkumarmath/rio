from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class AdministrativeUser(Base):
    __tablename__ = "administrative_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    announcements = relationship("Announcement", back_populates="author")
    audit_logs = relationship("AuditLog", back_populates="admin")

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), unique=True, nullable=False)

    alumni = relationship("AlumniProfile", back_populates="department")

class GraduationBatch(Base):
    __tablename__ = "graduation_batches"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, unique=True, index=True, nullable=False)

    alumni = relationship("AlumniProfile", back_populates="batch")

class AlumniProfile(Base):
    __tablename__ = "alumni_profiles"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20))
    location = Column(String(100))
    bio = Column(Text)
    
    department_id = Column(Integer, ForeignKey("departments.id"))
    batch_id = Column(Integer, ForeignKey("graduation_batches.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    department = relationship("Department", back_populates="alumni")
    batch = relationship("GraduationBatch", back_populates="alumni")
    education_history = relationship("EducationHistory", back_populates="alumni", cascade="all, delete-orphan")
    employment_history = relationship("EmploymentHistory", back_populates="alumni", cascade="all, delete-orphan")

class EducationHistory(Base):
    __tablename__ = "education_history"

    id = Column(Integer, primary_key=True, index=True)
    alumni_id = Column(Integer, ForeignKey("alumni_profiles.id"), nullable=False)
    degree = Column(String(100), nullable=False)
    field_of_study = Column(String(100), nullable=False)
    institution = Column(String(150), nullable=False)
    start_year = Column(Integer)
    end_year = Column(Integer)

    alumni = relationship("AlumniProfile", back_populates="education_history")

class EmploymentHistory(Base):
    __tablename__ = "employment_history"

    id = Column(Integer, primary_key=True, index=True)
    alumni_id = Column(Integer, ForeignKey("alumni_profiles.id"), nullable=False)
    company = Column(String(150), nullable=False)
    title = Column(String(100), nullable=False)
    start_date = Column(Date)
    end_date = Column(Date)
    is_current = Column(Boolean, default=False)

    alumni = relationship("AlumniProfile", back_populates="employment_history")

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    posted_by = Column(Integer, ForeignKey("administrative_users.id"), nullable=False)
    posted_at = Column(DateTime(timezone=True), server_default=func.now())
    is_published = Column(Boolean, default=True)

    author = relationship("AdministrativeUser", back_populates="announcements")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("administrative_users.id"))
    action = Column(String(50), nullable=False) # e.g. "CREATE", "UPDATE", "DELETE"
    target_table = Column(String(50), nullable=False)
    target_id = Column(Integer)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(JSON)

    admin = relationship("AdministrativeUser", back_populates="audit_logs")
