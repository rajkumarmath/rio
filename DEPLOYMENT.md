# Cloud Deployment Guide (Free Tier)

This guide covers deploying AlumniSphere securely using free-tier cloud providers. 

## Recommended Stack
- **Database**: [Neon](https://neon.tech) or [Supabase](https://supabase.com) (Serverless PostgreSQL)
- **Backend API**: [Render](https://render.com) (FastAPI Web Service)
- **Frontend App**: [Vercel](https://vercel.com) (Next.js Application)

---

## 1. Database Setup (Neon / Supabase)
1. Sign up for a free PostgreSQL database.
2. Retrieve the **Connection String** (URI).
3. Prepare a secondary disposable database for testing if desired.
*Important:* Do not share your connection string or commit it to GitHub.

---

## 2. Backend Deployment (Render)
Render natively supports Python applications and binds to the `$PORT` environment variable automatically.

### Steps
1. Create a new **Web Service** on Render and link your GitHub repository.
2. Set the Root Directory to `backend/`.
3. Set the Build Command:
   ```bash
   pip install -r requirements.txt
   ```
4. Set the Start Command (Automates migrations & seeding without needing a Shell):
   ```bash
   alembic upgrade head && python seed_demo_data.py && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Environment Variables
Configure these in the Render dashboard (Environment tab):
- `DATABASE_URL`: Your Neon PostgreSQL connection string (e.g., `postgresql://...`).
- `SECRET_KEY`: Generate a secure random string (e.g., `openssl rand -hex 32` or any long random text).
- `ALGORITHM`: `HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES`: `1440` (24 hours)
- `FRONTEND_URL`: The production URL of your Next.js app (e.g., `https://my-alumni-app.vercel.app`).

### Applying Migrations & Seeding Data on Free Tier (No Shell Required)
Since Render's interactive Web Shell is disabled on the free tier, use either of these methods:

#### Option A: Automated via Render Start Command (Recommended)
By setting the Start Command to:
```bash
alembic upgrade head && python seed_demo_data.py && uvicorn main:app --host 0.0.0.0 --port $PORT
```
Render automatically builds the tables, seeds the demo alumni and departments, and starts the API every time it deploys.

#### Option B: From Your Local Terminal (Direct to Cloud DB)
You can run migrations and create the admin user directly from your local terminal against your cloud database:
```powershell
# In Windows PowerShell:
$env:DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"
cd backend
.\venv\Scripts\python.exe -m alembic upgrade head
.\venv\Scripts\python.exe seed_demo_data.py
.\venv\Scripts\python.exe create_admin.py --username admin --email admin@reva.edu.in --password "YourAdminPassword123!"
```

---

## 3. Frontend Deployment (Vercel)
Vercel provides native optimization for Next.js applications.

### Steps
1. Create a new Project on Vercel and import your repository.
2. Set the **Framework Preset** to `Next.js`.
3. Set the **Root Directory** to `frontend/`.

### Environment Variables
Configure this in the Vercel dashboard before deploying:
- `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://my-backend-service.onrender.com`).

Vercel will automatically manage HTTPS and handle standard Next.js static optimizations.

---

## 4. Post-Deployment Verification Checklist

Once deployed, manually verify the following workflows in production:
1. **Public Site**: Ensure the Home, Alumni Directory, and Announcements pages load correctly.
2. **Admin Login**: Navigate to `/admin/login` and log in with the credentials created via `create_admin.py`.
3. **Security**: Ensure your session is maintained via HTTP-only secure cookies and verify that navigating to `/admin/alumni` works without CORS errors.
4. **Data Management**: Create a test alumni profile and a test announcement.
5. **CSV Import**: Test the importer module by uploading a mock Excel/CSV file to verify file handling constraints over the cloud.

## 5. PostgreSQL Integration Testing (Local/CI)
If you wish to run integration tests against a live PostgreSQL staging database before deploying:
1. Set up a disposable PostgreSQL database.
2. In your local terminal, run:
   ```bash
   export TEST_DATABASE_URL="postgresql://user:pass@host/test_db"
   pytest tests/test_postgres_integration.py -v
   ```
*Never point `TEST_DATABASE_URL` to a production database!*
