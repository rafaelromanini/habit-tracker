# Habit Tracker — API

REST API for the Habit Tracker application, built with Java 21 and Spring Boot 3.

---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Language       | Java 21                           |
| Framework      | Spring Boot 3.2                   |
| Security       | Spring Security + JWT (jjwt 0.12) |
| Database       | PostgreSQL 16                     |
| ORM            | Spring Data JPA + Hibernate       |
| Migrations     | Flyway                            |
| Validation     | Jakarta Bean Validation           |
| Documentation  | Springdoc OpenAPI (Swagger)       |
| Tests          | JUnit 5 + Mockito                 |
| Build          | Maven 3.9                         |
| Containerization | Docker + Docker Compose         |

---

## Project Structure

```
src/
└── main/
    ├── java/com/habittracker/
    │   ├── controller/         # REST endpoints
    │   ├── service/            # Business logic
    │   ├── repository/         # JPA repositories
    │   ├── model/              # JPA entities
    │   ├── dto/
    │   │   ├── request/        # Incoming payloads
    │   │   └── response/       # Outgoing payloads
    │   ├── security/
    │   │   ├── filter/         # JWT filter
    │   │   └── service/        # JWT generation & validation
    │   ├── exception/          # Custom exceptions
    │   │   └── handler/        # Global exception handler
    │   └── config/             # Security, CORS, OpenAPI
    └── resources/
        ├── application.yml
        └── db/migration/       # Flyway SQL migrations
```

---

## Getting Started

### Prerequisites

- Java 21+
- Docker & Docker Compose
- Maven 3.9+

### Run with Docker Compose

```bash
# Clone the repository
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker/backend

# Copy and configure environment variables
cp .env.example .env

# Start database + API
docker-compose up -d

# API available at http://localhost:8080
```

### Run locally (without Docker)

```bash
# Start only the database
docker-compose up -d db

# Run the API
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## API Endpoints

### Authentication

| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| POST   | /api/v1/auth/register | Register a new user      | No   |
| POST   | /api/v1/auth/login    | Login and receive JWT    | No   |

### Habits

| Method | Endpoint                      | Description                       | Auth |
|--------|-------------------------------|-----------------------------------|------|
| POST   | /api/v1/habits                | Create a new habit                | Yes  |
| GET    | /api/v1/habits/day?date=      | Get habits for a specific day     | Yes  |
| GET    | /api/v1/habits/summary        | Get full year grid summary        | Yes  |
| PATCH  | /api/v1/habits/{id}/toggle    | Toggle habit completion for today | Yes  |

### Users

| Method | Endpoint          | Description                   | Auth |
|--------|-------------------|-------------------------------|------|
| GET    | /api/v1/users/me  | Get authenticated user profile| Yes  |
| PUT    | /api/v1/users/me  | Update name or password       | Yes  |

---

## Authentication

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## API Documentation

Swagger UI is available at:

```
http://localhost:8080/swagger-ui.html
```

---

## Running Tests

```bash
./mvnw test
```

---

## Environment Variables

| Variable                | Description                        | Default   |
|-------------------------|------------------------------------|-----------|
| DATABASE_URL            | PostgreSQL JDBC URL                | —         |
| DATABASE_USERNAME       | Database username                  | —         |
| DATABASE_PASSWORD       | Database password                  | —         |
| JWT_SECRET_KEY          | Base64 encoded 256-bit secret      | —         |
| JWT_EXPIRATION          | Token expiration in ms             | 86400000  |
| SPRING_PROFILES_ACTIVE  | Active profile (dev/prod)          | dev       |
| CORS_ALLOWED_ORIGINS    | Comma-separated allowed origins    | localhost |

---

## Deploy (Railway)

1. Push the `backend/` folder to a GitHub repository
2. Create a new project on [Railway](https://railway.app)
3. Add a PostgreSQL service
4. Set all environment variables from the table above
5. Railway detects the `Dockerfile` and deploys automatically

---

## License

MIT
