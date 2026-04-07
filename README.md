  ---                                                                                                        
  # Habit Tracker                                                                                            
                                                                                                             
  Full-stack habit tracking application — visualize and manage your daily habits through a GitHub-style      
  contribution grid.                                        

  Built with **Java 21 + Spring Boot 3** on the back-end and **React + Vite + TypeScript** on the front-end.

  ---

  ## Tech Stack

  | Side      | Technologies |
  |-----------|-------------|
  | Back-end  | Java 21, Spring Boot 3, Spring Security, JWT, PostgreSQL 16, Flyway, Swagger |
  | Front-end | React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Axios |
  | Infra     | Docker, Docker Compose |

  ---

  ## Project Structure

  habit-tracker/
  ├── backend/    # Java 21 + Spring Boot 3 REST API
  └── frontend/   # React + Vite + TypeScript + Tailwind CSS

  ---

  ## Quick Start

  ### 1. Back-end

  ```bash
  cd backend
  cp .env.example .env   # fill in JWT_SECRET_KEY and database credentials
  docker-compose up -d   # starts PostgreSQL + Spring Boot API

  2. Front-end

  cd frontend
  cp .env.example .env   # set VITE_API_URL=http://localhost:8080/api/v1
  npm install
  npm run dev

  ┌──────────┬───────────────────────────────────────┐
  │ Service  │                  URL                  │
  ├──────────┼───────────────────────────────────────┤
  │ API      │ http://localhost:8080                 │
  ├──────────┼───────────────────────────────────────┤
  │ Swagger  │ http://localhost:8080/swagger-ui.html │
  ├──────────┼───────────────────────────────────────┤
  │ Frontend │ http://localhost:5173                 │
  └──────────┴───────────────────────────────────────┘

  ---
  Features

  - Register / Login — JWT-based authentication
  - Habit grid — GitHub-style yearly view with completion color intensity
  - Day popup — click any day to see and toggle habits for that date
  - Create habit — define title and recurrence days of the week
  - Manage habits — list and delete existing habits

  ---
  API Overview

  ┌────────┬────────────────────────────────────┬───────────────────────────┐
  │ Method │              Endpoint              │        Description        │
  ├────────┼────────────────────────────────────┼───────────────────────────┤
  │ POST   │ /api/v1/auth/register              │ Create account            │
  ├────────┼────────────────────────────────────┼───────────────────────────┤
  │ POST   │ /api/v1/auth/login                 │ Authenticate and get JWT  │
  ├────────┼────────────────────────────────────┼───────────────────────────┤
  │ GET    │ /api/v1/habits                     │ List all habits           │
  ├────────┼────────────────────────────────────┼───────────────────────────┤
  │ POST   │ /api/v1/habits                     │ Create a habit            │
  ├────────┼────────────────────────────────────┼───────────────────────────┤
  │ DELETE │ /api/v1/habits/{id}                │ Delete a habit            │
  ├────────┼────────────────────────────────────┼───────────────────────────┤
  │ GET    │ /api/v1/habits/summary             │ Yearly completion summary │
  ├────────┼────────────────────────────────────┼───────────────────────────┤
  │ GET    │ /api/v1/habits/day?date=YYYY-MM-DD │ Habits for a specific day │
  ├────────┼────────────────────────────────────┼───────────────────────────┤
  │ PATCH  │ /api/v1/habits/{id}/toggle         │ Toggle today's completion │
  └────────┴────────────────────────────────────┴───────────────────────────┘

  Full documentation available at Swagger UI after starting the API.

  ---
  See backend/README.md for deploy instructions and environment variables reference.
  ```
