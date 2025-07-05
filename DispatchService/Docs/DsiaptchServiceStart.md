
# 🚚 DispatchService

## 📌 Overview

The **DispatchService** is responsible for handling dispatch creation, enforcing vehicle safety requirements, and coordinating the lifecycle of vehicle movements. It interacts with:

- 🧑‍💼 **AuthService** for validating user/admin tokens  
- 🚘 **VehicleService** to fetch vehicle status and condition  
- 🪵 **LoggingService** to track dispatch history  

---

## ⚙️ Tech Stack

- Java 17+
- Spring Boot
- RabbitMQ (for event publishing)
- PostgreSQL (data store)
- Gradle
- Feign Clients (HTTP calls)
- Resilience4j (circuit breaker)
- JWT Security (via AuthService)

---

## 🚀 How to Run

### ☕ Option 1 — Manual Dev Mode (Local JVM)

By default, the `application.yml` is used for development setup.

```bash
./gradlew bootRun
````

📝 Dev Database

```
jdbc:postgresql://localhost:5432/VEHICLE_DISPATCH_DB
username: postgres
password: bomboclat
```

📝 RabbitMQ

```
host: localhost
port: 5672
username: bright
password: secret123
```

---

### 🔐 Option 2 — Production Mode (Manual JAR)

Use `application-prod.yml` with environment variables.

```bash
export SPRING_PROFILES_ACTIVE=prod

# then run
java -jar build/libs/dispatch-service.jar
```

### ✅ Required Environment Variables

| Variable            | Description                     |
| ------------------- | ------------------------------- |
| `APP_PORT`          | Port to run the DispatchService |
| `SQL_URL`           | JDBC URL for PostgreSQL         |
| `SQL_USER`          | PostgreSQL username             |
| `SQL_PASSWORD`      | PostgreSQL password             |
| `JWT_SECRET`        | JWT signing secret              |
| `JWT_EXP`           | JWT expiration duration         |
| `RABBITMQ_URL`      | RabbitMQ host                   |
| `RABBITMQ_PORT`     | RabbitMQ port                   |
| `RABBITMQ_USER`     | RabbitMQ username               |
| `RABBITMQ_PASSWORD` | RabbitMQ password               |
| `LOGGING_URL`       | Logging service base URL        |
| `VEHICLE_URL`       | Vehicle service base URL        |
| `AUTH_URL`          | Auth service base URL           |

---

### 🐳 Option 3 — Docker (Recommended)

#### 🏗 Build Docker Image

```bash
docker build -t dispatch-service .
```

#### 🧪 Run in Development (Docker)

```bash
docker run -p 8105:8105 \
  -e SPRING_PROFILES_ACTIVE=default \
  -e SQL_URL=jdbc:postgresql://host.docker.internal:5432/VEHICLE_DISPATCH_DB \
  -e SQL_USER=postgres \
  -e SQL_PASSWORD=bomboclat \
  -e RABBITMQ_URL=host.docker.internal \
  -e RABBITMQ_PORT=5672 \
  -e RABBITMQ_USER=bright \
  -e RABBITMQ_PASSWORD=secret123 \
  dispatch-service
```

🧠 `host.docker.internal` connects to services running on your host machine (for Mac/Windows).

#### 🚀 Run in Production (Docker)

```bash
docker run -p 8105:8105 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SQL_URL=jdbc:postgresql://<prod-db-host>:5432/prod_dispatch_db \
  -e SQL_USER=prod_user \
  -e SQL_PASSWORD=securepassword \
  -e JWT_SECRET=supersecret \
  -e JWT_EXP=86400000 \
  -e RABBITMQ_URL=<rabbit-host> \
  -e RABBITMQ_PORT=5672 \
  -e RABBITMQ_USER=prod_rabbit \
  -e RABBITMQ_PASSWORD=prod_secret \
  -e LOGGING_URL=http://logging-service:8000 \
  -e VEHICLE_URL=http://vehicle-service:8001 \
  -e AUTH_URL=http://auth-service:8002 \
  dispatch-service
```

#### 📦 Docker Output

* Port exposed: `8105`
* Container logs stream to stdout
* Supports `/actuator/health` if actuator is enabled

---

## 🛡️ Circuit Breaker Example

```yaml
resilience4j:
  circuitbreaker:
    instances:
      myServiceCircuitBreaker:
        failureRateThreshold: 80
        waitDurationInOpenState: 22s
        permittedNumberOfCallsInHalfOpenState: 7
```

---

## 📡 RabbitMQ Integration

```yaml
spring:
  rabbitmq:
    host: ${RABBITMQ_URL}
    port: ${RABBITMQ_PORT}
    username: ${RABBITMQ_USER}
    password: ${RABBITMQ_PASSWORD}
```

Used for:

* `dispatch.created` (direct & fanout)
* `dispatch.validated` (fanout)
* `dispatch.completed` (fanout)
* `start.tracking` and `dispatch.finished` (incoming fanout)

---

## 🧪 Health Check

Exposed at:

```
GET /actuator/health
```

---

## 🔐 Auth Integration

Validates incoming JWTs and verifies roles/claims using:

* JWT Secret (`auth.jwt.secret`)
* AuthService via HTTP client

---

## 📇 Configuration Files

| File                   | Description                               |
| ---------------------- | ----------------------------------------- |
| `application.yml`      | Local/dev config (hardcoded values)       |
| `application-prod.yml` | Production config (uses environment vars) |

---

## 🧱 Dockerfile (Multi-stage)

```Dockerfile
# === Stage 1: Build
FROM gradle:8.8-jdk21 AS build
WORKDIR /app
COPY gradlew gradlew.bat build.gradle settings.gradle /app/
COPY gradle/wrapper/ /app/gradle/wrapper/
COPY . /app/
RUN gradle build --no-daemon -x test

# === Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8105
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

---

## 🤝 Contributing

1. Pull the latest changes from `main`
2. Create a new branch: `feature/<name>` or `fix/<name>`
3. Implement feature with tests and documentation
4. Open a PR and request review

---

## 👨‍🔧 Maintainer

**Bright Akinola** – Dispatch Lead Engineer 🚀

