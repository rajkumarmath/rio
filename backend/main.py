from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import importer, alumni, association, announcements, admin_alumni, admin_stats

app = FastAPI(
    title="AlumniSphere API",
    description="Backend API for AlumniSphere",
    version="1.0.0",
)

# Parse comma-separated origins and strip trailing slashes
raw_origins = settings.FRONTEND_URL.split(",")
allowed_origins = [orig.strip().rstrip("/") for orig in raw_origins if orig.strip()]
if "http://localhost:3000" not in allowed_origins:
    allowed_origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
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
