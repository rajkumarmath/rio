from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import importer, alumni, association, announcements, admin_alumni, admin_stats

app = FastAPI(
    title="AlumniSphere API",
    description="Backend API for AlumniSphere",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(importer.router, prefix="/api/admin/importer", tags=["importer"])
app.include_router(admin_alumni.router, prefix="/api/admin/alumni", tags=["admin_alumni"])
app.include_router(admin_stats.router, prefix="/api/admin/stats", tags=["admin_stats"])
app.include_router(alumni.router, prefix="/api/alumni", tags=["alumni"])
app.include_router(association.router, prefix="/api/association", tags=["association"])
app.include_router(announcements.router, prefix="/api/announcements", tags=["announcements"])

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running!"}
