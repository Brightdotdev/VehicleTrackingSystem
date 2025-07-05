# 🪵 LoggingService

## ✨ Overview

The **LoggingService** handles audit logging and event tracking within the vehicle tracking system. It listens to RabbitMQ messages and stores them in MongoDB for persistence and searchability.

It integrates with:

* 🔐 **AuthService** for user validation (via JWT)
* 🚘 **VehicleService** and 🛻 **DispatchService** for capturing operational events

---

## ⚙️ Tech Stack

* Java 17+
* Spring Boot
* MongoDB (document store)
* RabbitMQ (event queue)
* Gradle (build system)
* Resilience4j (circuit breaking)
* JWT Auth (for validation)

---

## 🚀 How to Start

### 💡 Development Mode

Uses `application.yml` (with hardcoded dev values):

```bash
./gradlew bootRun
```

✉️ MongoDB:

```
mongodb://localhost:27017/LOGGING_SERVICE
```

✉️ RabbitMQ:

```
localhost:5672
username: bright
password: secret123
```

---

### 💪 Docker Run (Dev or Prod)

Build and run the service with Docker:

```bash
# 🔿 Build the image
docker build -t logging-service .

# ▶️ Run the container

docker run -p 8104:8104 \
  -e APP_PORT=8104 \
  -e MONGO_URL=mongodb://localhost:27017/LOGGING_SERVICE \
  -e JWT_SECRET=<your_jwt_secret> \
  -e JWT_EXP=604800000 \
  -e RABBITMQ_URL=localhost \
  -e RABBITMQ_PORT=5672 \
  -e RABBITMQ_USER=bright \
  -e RABBITMQ_PASSWORD=secret123 \
  logging-service
```

---

### 🔐 Required Environment Variables

| Variable            | Description               |
| ------------------- | ------------------------- |
| `APP_PORT`          | Port to expose the app on |
| `MONGO_URL`         | MongoDB connection URI    |
| `JWT_SECRET`        | JWT signing secret        |
| `JWT_EXP`           | JWT expiration time in ms |
| `RABBITMQ_URL`      | RabbitMQ host             |
| `RABBITMQ_PORT`     | RabbitMQ port             |
| `RABBITMQ_USER`     | RabbitMQ username         |
| `RABBITMQ_PASSWORD` | RabbitMQ password         |

---

## 🛠️ Circuit Breaker Config

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

## 📧 RabbitMQ Listener

The service consumes and logs events from RabbitMQ:

```yaml
spring.rabbitmq:
  host: ...
  port: ...
  username: ...
  password: ...
  listener:
    simple:
      default-requeue-rejected: false
      retry:
        enabled: true
        max-attempts: 3
        initial-interval: 1000
        multiplier: 2.0
        max-interval: 10000
```

---

## 🔍 Logging

Debug logs are enabled for core modules:

```yaml
logging:
  level:
    org.springframework.security: DEBUG
    com.example.UserService: DEBUG
```

---

## ✅ Health Check

> Exposed at `/actuator/health` if Spring Boot Actuator is enabled.

---

## 📇 Config Files

| File                   | Description                                |
|------------------------| ------------------------------------------ |
| `application.-prodyml` | Production-ready config with env variables |
| `application.yml`      | Dev config with hardcoded values           |

---

## 🤝 Contributing

1. Pull latest branch
2. Branch off `main`
3. Add your feature or fix
4. Comment important logic
5. Submit a PR

---

## 🧑‍💻 Maintainers

* Bright Akinola — Logging Lead
* [Emmanuel Chigbo ](https://github.com/EmmanuelChigbo) - Major contributor 
