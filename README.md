# Habit Tracker

Full-stack habit tracking application inspired by the NLW Setup (Rocketseat) design.

Built with **Java 21 + Spring Boot 3** on the back-end and **React + Vite + TypeScript** on the front-end.

---

## Project Structure

```
habit-tracker/
├── backend/    # Java 21 + Spring Boot 3 REST API
└── frontend/   # React + Vite + TypeScript + Tailwind CSS
```

## Quick Start

```bash
# 1. Start the database and API
cd backend
cp .env.example .env
docker-compose up -d

# 2. Start the front-end
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- Frontend: http://localhost:5173

---

See `backend/README.md` for full API documentation and deploy instructions.
