# AlumniSphere

This is the monorepo for AlumniSphere, containing both the Next.js frontend and the FastAPI backend.

## Prerequisites for Windows 11
- Node.js (v18+)
- Python (v3.10+)
- Git

## Project Structure
- `/frontend`: Next.js web application
- `/backend`: Python FastAPI server

## Setup Instructions

### 1. Backend Setup
Open a terminal (PowerShell or Command Prompt) and run:
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### Database Setup
You will need a PostgreSQL server running locally or a remote hosted database.
1. Create a PostgreSQL database (e.g., `alumnidb`).
2. Copy `backend/.env.example` to `backend/.env` and update `DATABASE_URL` with your actual credentials.
3. Apply database migrations to create the tables:
```cmd
cd backend
venv\Scripts\activate
alembic upgrade head
```

### 2. Frontend Setup
Open another terminal and run:
```cmd
cd frontend
npm install
```

## Running the Application Locally (Independent)

### Run Backend
With the virtual environment activated, run:
```cmd
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```
- API Health Check: [http://localhost:8000/health](http://localhost:8000/health)
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Run Frontend
In a new terminal, run:
```cmd
cd frontend
npm run dev
```
- Web Application: [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL`: Connection string for the database (e.g., `postgresql://user:password@localhost/alumni_db` or `sqlite:///./alumni.db`).
- `SECRET_KEY`: A secure random string for JWT hashing.
- `ALGORITHM`: Usually `HS256`.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: e.g. `1440` (1 day).

### Frontend (`frontend/.env`)
- `NEXT_PUBLIC_API_URL`: The URL of the backend API (e.g., `http://localhost:8000` or the production URL).

## PostgreSQL Database Setup (Production Readiness)

The backend uses SQLAlchemy and Alembic, which are fully configured and verified to be compatible with PostgreSQL (e.g. `server_default=sa.text('CURRENT_TIMESTAMP')`).

**Steps to run against a live PostgreSQL instance:**
1. Install PostgreSQL drivers (if not present): `pip install psycopg2-binary` or `asyncpg`.
2. Update the `DATABASE_URL` in `backend/.env` to point to your PostgreSQL instance.
3. Run Alembic migrations to construct the schema:
   ```cmd
   cd backend
   alembic upgrade head
   ```
4. Verify the database tables were created successfully using a DB client (e.g., pgAdmin, psql).
*Note: Our automated test suite natively mocks the database via SQLite to preserve the integrity of local environments. PostgreSQL integration must be verified manually during final staging.*
