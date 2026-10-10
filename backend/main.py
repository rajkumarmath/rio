from fastapi import FastAPI

app = FastAPI(
    title="Alumni Platform API",
    description="Backend API for the University Alumni Association Platform",
    version="1.0.0",
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running!"}
