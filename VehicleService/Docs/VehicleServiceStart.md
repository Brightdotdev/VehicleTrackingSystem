# 🚘 VehicleService

## 📌 Overview

The **VehicleService** manages all vehicle-related data and status within the vehicle tracking system. It performs vehicle validation, safety scoring, and integrates with:

* 🔐 **AuthService** for token validation
* 🪝 **DispatchService** for dispatch coordination
* 🪵 **LoggingService** for event tracking via RabbitMQ

---

## ⚙️ Tech Stack

* Java 17+
* Spring Boot
* RabbitMQ (event messaging)
* PostgreSQL (vehicle data persistence)
* Gradle (build system)
* JWT Auth
* Resilience4j (fault tolerance)

---

## 🚀 How to Start

### 🧪 Development Mode

By default, `application.yml` is used (local hardcoded values).

```bash
./gradlew bootRun
```

📝 Dev Database (PostgreSQL):

```
jdbc:postgresql://localhost:5432/VEHICLE_VEHICLE_DB
username: postgres
password: bomboclat
```

📝 RabbitMQ:

```
host: localhost
port: 5672
username: bright
password: secret123
```

---

### 🐳 Docker Run (Dev or Prod)

Use the Dockerfile to build and run the service:

```bash
# 🏗 Build the image
docker build -t vehicle-service .

# ▶️ Run in production mode
# Set environment variables as shown below

docker run -p 8106:8106 \
  -e APP_PORT=8106 \
  -e SQL_URL=jdbc:postgresql://<your-db-host>:5432/VEHICLE_VEHICLE_DB \
  -e SQL_USER=postgres \
  -e SQL_PASSWORD=bomboclat \
  -e JWT_SECRET=<your_jwt_secret> \
  -e JWT_EXP=604800000 \
  -e RABBITMQ_URL=localhost \
  -e RABBITMQ_PORT=5672 \
  -e RABBITMQ_USER=bright \
  -e RABBITMQ_PASSWORD=secret123 \
  vehicle-service
```

---

### 🔐 Environment Variables

| Variable            | Description                    |
| ------------------- | ------------------------------ |
| `APP_PORT`          | Port for the application       |
| `SQL_URL`           | PostgreSQL JDBC URL            |
| `SQL_USER`          | PostgreSQL username            |
| `SQL_PASSWORD`      | PostgreSQL password            |
| `JWT_SECRET`        | JWT signing secret             |
| `JWT_EXP`           | JWT expiration in milliseconds |
| `RABBITMQ_URL`      | RabbitMQ host                  |
| `RABBITMQ_PORT`     | RabbitMQ port                  |
| `RABBITMQ_USER`     | RabbitMQ username              |
| `RABBITMQ_PASSWORD` | RabbitMQ password              |

---

## 🛠️ Circuit Breaker Config

Using Resilience4j to protect external calls:

```yaml
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

## 🐇 RabbitMQ

Vehicle events are published and consumed via RabbitMQ.

```yaml
spring.rabbitmq:
  host: ...
  port: ...
  username: ...
  password: ...
```

Retries and backoff are configured to avoid infinite message loops.

---

## 🔍 Logging

Logging level is set to debug for important modules:

```yaml
logging:
  level:
    org.springframework.security: DEBUG
    com.example.UserService: DEBUG
```

---

## ✅ Health Check

> If Spring Boot Actuator is enabled, health is exposed at:

```
/actuator/health
```

---

## 📇 Configuration Files

| File                   | Description                            |
|------------------------| -------------------------------------- |
| `application-prod.yml` | Production-ready config with env vars  |
| `application.yml`      | Local dev config with hardcoded values |

---

## 🤝 Contributing

1. Pull latest branch
2. Create feature/fix branch
3. Ensure new features are tested
4. Comment all service methods
5. Submit PR with changelog

---

## 🧑‍🔧 Maintainer

* Bright Akinola — Vehicle Lead
