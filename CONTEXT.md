# Student CRUD — Project Context

**GitHub repo:** `https://github.com/SiegfridP/student-crud.git`  
**Last commit:** `e8fd49e` — Fix frontend build errors and add Render.com deployment config  
**Branch:** `main`  
**Working directory:** `c:\Users\Student-00\Documents\Pineda, Siegfrid - SIA\STUDENT-CRUD`

---

## 📁 Project Structure

```
STUDENT-CRUD/                       ← Project root
├── render.yaml                     ← Render.com blueprint (backend + frontend + DB)
├── CONTEXT.md                      ← This file
├── .gitignore
├── README.md (optional)
│
├── student/                        ← Spring Boot backend (Java 21, Maven)
│   ├── Dockerfile                  ← Docker build for Render
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── src/main/java/com/pineda/student/
│       ├── Student.java            ← Entity: id, firstname, lastname, course, section
│       ├── StudentController.java  ← REST controller + CORS config
│       ├── StudentRepository.java  ← CrudRepository
│       └── StudentApplication.java
│   └── src/main/resources/
│       └── application.properties  ← DB + server config (env var fallbacks)
│
└── frontend/                       ← Vite + React + Tailwind CSS (JavaScript)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.cjs
    ├── postcss.config.js
    ├── index.html
    ├── .env.example
    ├── .gitignore
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx                 ← React Router: /, /students/new, /students/:id, /students/:id/edit
    │   ├── styles/index.css
    │   ├── api/studentApi.js       ← API client (VITE_API_BASE_URL support)
    │   ├── components/
    │   │   ├── StudentList.jsx     ← List + search + table + View/Edit/Delete
    │   │   └── StudentForm.jsx     ← Create/Edit form (no modals — full page)
    │   └── pages/
    │       └── StudentDetail.jsx   ← Detail view with Edit/Delete buttons
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot 4.1.1, Java 21, Spring Data JPA, PostgreSQL |
| Frontend | React 19, React Router DOM 7, Vite 8, Tailwind CSS 4 |
| Build | Maven (backend), Vite + npm (frontend) |
| Deployment | Render.com (Blueprint via `render.yaml`) |

---

## 🚀 Local Development

### Terminal 1 — Backend
```powershell
cd 'c:\Users\Student-00\Documents\Pineda, Siegfrid - SIA\STUDENT-CRUD\student'
.\mvnw.cmd spring-boot:run
```
Backend runs on **port 8080**. Requires PostgreSQL at `localhost:5432/db_student` (user: `postgres`, pass: `admin`).

### Terminal 2 — Frontend
```powershell
cd 'c:\Users\Student-00\Documents\Pineda, Siegfrid - SIA\STUDENT-CRUD\frontend'
npm install
npm run dev
```
Frontend runs on **port 5173** → `http://localhost:5173`

### Routes
| Path | Component |
|------|-----------|
| `/` | `StudentList` (list + search + table) |
| `/students/new` | `StudentForm` (create) |
| `/students/:id` | `StudentDetail` (view) |
| `/students/:id/edit` | `StudentForm` (edit) |
---

## 🌐 Render.com Deployment

**Repo:** https://github.com/SiegfridP/student-crud.git

### Deploy steps
1. Go to [render.com](https://render.com) → **New → Blueprint**
2. Connect GitHub repo
3. Render detects ender.yaml and provisions:

| Service | Type | Details |
|---------|------|---------|
| student-crud-db | PostgreSQL | Free, db_student |
| student-crud-backend | Web (Docker) | Spring Boot, port 8080 |
| student-crud-frontend | Web (Static) | Vite build, SPA rewrite |

### Environment variables (auto-wired via ender.yaml)
- DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD → injected from student-crud-db
- VITE_API_BASE_URL → https://student-crud-backend.onrender.com (on frontend service)

---

## 📝 Key Implementation Notes

### API contract (/pineda/students)
| Method | Endpoint | Response |
|--------|----------|----------|
| GET | /pineda/students | JSON array of Student objects |
| GET | /pineda/students/{id} | Student object or 404 string |
| POST | /pineda/students | 201 + created Student |
| PUT | /pineda/students/{id} | 200 + updated Student or 404 |
| DELETE | /pineda/students/{id} | 200 + "Student with id N deleted." or 404 |

### Student entity fields
- id (Integer, auto-generated)
- irstname (String)
- lastname (String)
- course (String)
- section (String)

### CORS
StudentController.java includes a CorsConfig bean allowing * origins for /pineda/students/** — required because frontend and backend are on different domains in production.

### Tailwind CSS v4
Uses @import "tailwindcss" in index.css and @tailwindcss/postcss PostCSS plugin (not the v3 @tailwind directives).

### API client (studentApi.js)
`js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const BASE_PATH = ${API_BASE_URL}/pineda/students;
`
- **Local dev:** VITE_API_BASE_URL is empty → relative path → Vite proxy → localhost:8080
- **Production:** VITE_API_BASE_URL=https://student-crud-backend.onrender.com → absolute URL

---

## 📋 Git Status (as of last push)

`
Last commit: e8fd49e (main) — Fix frontend build errors and add Render.com deployment config
Remote: origin → https://github.com/SiegfridP/student-crud.git
Working tree: clean
`

### Files changed in last commit
- rontend/.env.example (new)
- rontend/src/api/studentApi.js (modified)
- student/src/main/java/com/pineda/student/StudentController.java (modified)
- student/src/main/resources/application.properties (modified)

### Already tracked (from earlier push)
- ender.yaml, student/Dockerfile, rontend/index.html, rontend/postcss.config.js, rontend/src/styles/index.css

---

## 🛠 If You Need to Rebuild Everything

`ash
# Clone the repo
git clone https://github.com/SiegfridP/student-crud.git
cd student-crud

# Backend
cd student
.\mvnw.cmd spring-boot:run   # (Windows) or ./mvnw spring-boot:run (Mac/Linux)

# Frontend (new terminal)
cd frontend
npm install
npm run dev
`

Then open http://localhost:5173.

---

## ⚠ Known Limitations
- Backend requires PostgreSQL running locally for dev (Render provides it automatically in production)
- VITE_API_BASE_URL must be set in Render dashboard for production API calls (already in ender.yaml)
- No authentication/authorization implemented yet
