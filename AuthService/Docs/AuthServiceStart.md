

# 🔐 AuthService

## 📌 Overview

The **AuthService** is responsible for authenticating and managing users in the Vehicle Tracking System. It supports:

- 🧍 User and admin registration/login
- 🔐 JWT generation and validation
- 🟢 Google OAuth (if configured)
- 📤 Event publishing to RabbitMQ (e.g., login tracking)
- 💾 PostgreSQL persistence
- 🧯 Resilience4j fault tolerance for external calls

---

## ⚙️ Tech Stack

- Java 17+
- Spring Boot
- Spring Security + JWT
- RabbitMQ (for event messaging)
- PostgreSQL
- Gradle (build system)
- Resilience4j (circuit breaker)

---

## 🚀 How to Run

### ☕ Option 1 — Run in Development (Manual)

Uses `application.yml` (hardcoded dev values).

```bash
./gradlew bootRun
````

📝 Dev DB connection:

```
jdbc:postgresql://localhost:5432/VEHICLE_AUTH_DB
username: postgres
password: bomboclat
```

📝 RabbitMQ dev config:

```
host: localhost
port: 5672
username: bright
password: secret123
```

---

### 🔐 Option 2 — Run in Production (Manual)

Production profile uses `application-prod.yml` and environment variables.

#### ✅ Required Environment Variables

| Variable            | Description                      |
| ------------------- | -------------------------------- |
| `APP_PORT`          | Port to run the AuthService      |
| `SQL_URL`           | JDBC URL for PostgreSQL          |
| `SQL_USER`          | PostgreSQL username              |
| `SQL_PASSWORD`      | PostgreSQL password              |
| `JWT_SECRET`        | JWT signing key                  |
| `JWT_EXP`           | JWT expiration (in milliseconds) |
| `RABBITMQ_URL`      | RabbitMQ hostname                |
| `RABBITMQ_PORT`     | RabbitMQ port                    |
| `RABBITMQ_USER`     | RabbitMQ username                |
| `RABBITMQ_PASSWORD` | RabbitMQ password                |

#### ▶️ Start in Production

```bash
export SPRING_PROFILES_ACTIVE=prod

# Run the service
java -jar build/libs/auth-service.jar
```

---

### 🐳 Option 3 — Docker (Recommended)

#### 🏗 Build Docker Image

```bash
docker build -t auth-service .
```

#### 🧪 Run in Development (Docker)

```bash
docker run -p 8103:8103 \
  -e SPRING_PROFILES_ACTIVE=default \
  -e SQL_URL=jdbc:postgresql://host.docker.internal:5432/VEHICLE_AUTH_DB \
  -e SQL_USER=postgres \
  -e SQL_PASSWORD=bomboclat \
  -e RABBITMQ_URL=host.docker.internal \
  -e RABBITMQ_PORT=5672 \
  -e RABBITMQ_USER=bright \
  -e RABBITMQ_PASSWORD=secret123 \
  auth-service
```

#### 🚀 Run in Production (Docker)

```bash
docker run -p 8103:8103 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SQL_URL=jdbc:postgresql://<prod-db-host>:5432/prod_auth_db \
  -e SQL_USER=prod_user \
  -e SQL_PASSWORD=secure_pass \
  -e JWT_SECRET=super_secret_jwt \
  -e JWT_EXP=604800000 \
  -e RABBITMQ_URL=<rabbit-host> \
  -e RABBITMQ_PORT=5672 \
  -e RABBITMQ_USER=prod_rabbit \
  -e RABBITMQ_PASSWORD=prod_rabbit_pwd \
  auth-service
```

---

## 🧾 Config Files

| File                   | Description                       |
| ---------------------- | --------------------------------- |
| `application.yml`      | Development config (local)        |
| `application-prod.yml` | Production config (uses env vars) |

---

## 🛡️ JWT & OAuth

* JWT secret is injected via `JWT_SECRET` env var.
* Expiry defaults to 7 days (`604800000` ms).
* OAuth config can be added using:

```yaml
google.client:
  id: <your-client-id>
  secret: <your-client-secret>
```

---

## 🔌 RabbitMQ Config

Configured for event publishing (e.g. login logs):

```yaml
spring.rabbitmq:
  host: ${RABBITMQ_URL}
  port: ${RABBITMQ_PORT}
  username: ${RABBITMQ_USER}
  password: ${RABBITMQ_PASSWORD}
```

---

## 🛠️ Circuit Breaker

Using **Resilience4j**:

```yaml
resilience4j:
  circuitbreaker:
    instances:
      myServiceCircuitBreaker:
        failureRateThreshold: 80
        waitDurationInOpenState: 22s
        permittedNumberOfCallsInHalfOpenState: 7
```

Auto-recovery between states: `OPEN` → `HALF_OPEN` → `CLOSED`.

---

## 🧪 Health Check

If Spring Boot Actuator is enabled:

```
GET /actuator/health
```

---

## 🔍 Logging

Debug logging is enabled for:

```yaml
logging:
  level:
    org.springframework.security: DEBUG
    com.example.UserService: DEBUG
```

---

## 🐳 Dockerfile (Multi-Stage)

```dockerfile
# =======================
# 🏗 Stage 1: Build stage
# =======================
FROM gradle:8.8-jdk21 AS build
WORKDIR /app

# Copy wrapper and settings
COPY gradlew gradlew.bat build.gradle settings.gradle /app/
COPY gradle/wrapper/ /app/gradle/wrapper/
COPY . /app/

RUN gradle build --no-daemon -x test

# ========================
# 🏃 Stage 2: Runtime
# ========================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8103
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

---

## 🤝 Contributing

1. Pull latest `main`
2. Create a new feature or fix branch
3. Write clean code with comments
4. Test endpoints locally
5. Submit PR and include changelog

---

## 👨‍💻 Maintainer

**Bright Akinola** — Lead Auth Developer 🚀


