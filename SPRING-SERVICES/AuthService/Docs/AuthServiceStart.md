# 🔐 AuthService

## 📌 Overview

The **AuthService** is responsible for handling user and admin authentication within the **Vehicle Tracking System**, which is composed of multiple services:

* 🚗 Vehicle Service
* 📦 Dispatch Service
* 📜 Logging Service
* 🌐 API Gateway
* 🔐 This AuthService

It handles:

* 🧍 User & Admin authentication
* 📤 JWT token generation and validation
* 🧾 Integration with other services via internal WebClients
* 💾 PostgreSQL persistence
* 🛡️ Resilience4j fault tolerance for remote service calls

---

## ⚙️ Tech Stack

* **Java 17+**
* **Spring Boot**
* **Spring Security + JWT**
* **PostgreSQL**
* **Gradle**
* **WebClient**
* **Resilience4j**

---

## 🚀 How to Run

### ☕ Option 1 — Run in Development (Manual)

> ⚠️ The included `application.yml` uses **hardcoded dev values** that will only work with **your own values**.
>
> Ensure PostgreSQL is running and credentials are correct.

```bash
./gradlew bootRun
# or
./gradlew build --no-daemon && java -jar build/libs/AuthService.jar
```

📝 Development defaults:

```
APP_PORT=8103
SQL_URL=jdbc:postgresql://localhost:5432/VEHICLE_AUTH_DB
SQL_USER=postgres
SQL_PASSWORD=bomboclat
JWT_SECRET=your-local-secret
JWT_EXP=604800000
API_INTERNAL_KEY=thisIsMyApiKey
LOGGING_URL=http://localhost:8104
VEHICLE_URL=http://localhost:8106
DISPATCH_URL=http://localhost:8105
```

---

### 🌍 Option 2 — Run in Production (Environment-based)

Uses `application-prod.yml` with placeholders loaded from **environment variables**.

#### ✅ Required Environment Variables

| Variable           | Description                                 |
| ------------------ | ------------------------------------------- |
| `APP_PORT`         | Port to run AuthService on                  |
| `SQL_URL`          | JDBC URL for PostgreSQL                     |
| `SQL_USER`         | PostgreSQL username                         |
| `SQL_PASSWORD`     | PostgreSQL password                         |
| `JWT_SECRET`       | HMAC secret used for signing JWTs           |
| `JWT_EXP`          | JWT expiry time in milliseconds             |
| `API_INTERNAL_KEY` | Shared internal key for microservice access |
| `LOGGING_URL`      | Logging service base URL                    |
| `VEHICLE_URL`      | Vehicle service base URL                    |
| `DISPATCH_URL`     | Dispatch service base URL                   |

#### ▶️ Start in Production

```bash
export SPRING_PROFILES_ACTIVE=prod
java -jar build/libs/AuthService-0.0.1-SNAPSHOT.jar
```

---

### 🐳 Option 3 — Run with Docker (Recommended)

#### 🧱 Build Docker Image

```bash
docker build -t auth-service .
```

#### 🧪 Run in Dev (Docker)

```bash
docker run -p 8103:8103 \
  -e APP_PORT=8103 \
  -e SQL_URL=jdbc:postgresql://host.docker.internal:5432/VEHICLE_AUTH_DB \
  -e SQL_USER=postgres \
  -e SQL_PASSWORD=bomboclat \
  -e JWT_SECRET=dev-secret-key \
  -e JWT_EXP=604800000 \
  -e API_INTERNAL_KEY=thisIsMyApiKey \
  -e LOGGING_URL=http://host.docker.internal:8104 \
  -e VEHICLE_URL=http://host.docker.internal:8106 \
  -e DISPATCH_URL=http://host.docker.internal:8105 \
  auth-service
```

---

## 🧾 Config Files

### application.yml (Default for local dev)

Hardcoded values for my local environment. Update the application.yml with yours.

### application-prod.yml

```yaml
server:
  port: ${APP_PORT}
  forward-headers-strategy: framework

spring:
  main:
    lazy-initialization: true
  application:
    name: authService
  datasource:
    url: ${SQL_URL}
    username: ${SQL_USER}
    password: ${SQL_PASSWORD}
  jpa:
    open-in-view: false
    show-sql: true
    hibernate:
      ddl-auto: update

auth:
  api:
    key: ${API_INTERNAL_KEY}
  jwt:
    secret: ${JWT_SECRET}
    expiration: ${JWT_EXP}
    issuer: auth-service

external:
  services:
    logging:
      base-url: ${LOGGING_URL}
    vehicle:
      base-url: ${VEHICLE_URL}
    dispatch:
      base-url: ${DISPATCH_URL}

logging:
  level:
    org.springframework.amqp: WARN
    com.rabbitmq: WARN
    org.springframework.security: DEBUG
    com.example.UserService: DEBUG

resilience4j:
  circuitbreaker:
    instances:
      myServiceCircuitBreaker:
        registerHealthIndicator: true
        slidingWindowSize: 15
        minimumNumberOfCalls: 10
        failureRateThreshold: 80
        waitDurationInOpenState: 22s
        permittedNumberOfCallsInHalfOpenState: 7
        automaticTransitionFromOpenToHalfOpenEnabled: true
```

---

## 🛡️ JWT Configuration

* `JWT_SECRET` is used for signing/verifying tokens.
* `JWT_EXP` is in **milliseconds** — default is 7 days.
* Tokens include subject (email), roles, userImage, and expiration.
* Validated using a `JwtRequestFilter` injected into the security chain.

---

## 🔌 Internal Service Authentication

* AuthService provides internal endpoints like `POST /internal/admin/create`.
* Access to internal endpoints is guarded by the `X-Internal-API-KeY` header.
* This key is checked against `${API_INTERNAL_KEY}` defined in config.

---

## 🧪 Health Check

Enable actuator for health ping support:

```http
GET /actuator/health
```

---

## 🤝 Contributing

1. Pull latest `main`
2. Create a new feature or fix branch
3. Comment your code cleanly
4. Test endpoints thoroughly
5. Submit a PR with meaningful changes

---

## 👨‍💻 Maintainer

**Bright Akinola** 
