# University Alumni Association Platform

This is the monorepo for the University Alumni Association Platform, containing both the Next.js frontend and the FastAPI backend.

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
- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env.local`
- Note: Do NOT commit `.env` files to source control.
