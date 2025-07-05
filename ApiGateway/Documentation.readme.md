# API Gateway

## 🚪 Overview

This is the API Gateway for our distributed microservices system. It routes requests to downstream services and handles cross-cutting concerns like:

* 🔐 **JWT Authentication** (via Authorization header or cookies)
* 🧭 **Routing** using Spring Cloud Gateway
* 🌍 **CORS config** for frontend clients
* 🧵 **Header deduplication** to prevent multi-source collisions

⚠️ **Important Note**: This API Gateway is part of a larger microservices architecture. For the system to work properly, you need to clone the entire repository and run all the dependent services. This gateway acts as the entry point and routes requests to the following services:

* **Auth Service** (Port 8103)
* **Logging Service** (Port 8104)
* **Dispatch Service** (Port 8105)
* **Vehicle Service** (Port 8106)
* **User Dashboard** (Port 3000)
* **Admin Dashboard** (Port 3001)

The gateway itself cannot function independently and requires these services to be running.

---

## ⚙️ Tech Stack

* Java 17+
* Spring Boot + Spring Cloud Gateway
* Gradle
* Project Reactor (Reactive Programming)
* JWT (via `jjwt`)

---

## 📦 How to Run

### 🔧 Prerequisites

Before running the API Gateway, ensure you have:

1. **Java 17+** installed
2. **Gradle** (or use the included wrapper)
3. **All microservices running** - This gateway depends on the following services:

    * Auth Service (default port: 8103)
    * Logging Service (default port: 8104)
    * Dispatch Service (default port: 8105)
    * Vehicle Service (default port: 8106)
    * User Dashboard (default port: 3000)
    * Admin Dashboard (default port: 3001)

### 🖥️ Development (with default profile)



# Start all required services first 
# Then navigate to the API Gateway
cd ApiGateWay

# Run with Gradle
./gradlew bootRun
```

### 🚀 Production (Manual)

Use the `application.prod.yml` config with the required environment variables:

```bash
PORT=8102 \
AUTH_URL=http://localhost:8103 \
LOGGING_URL=http://localhost:8104 \
DISPATCH_URL=http://localhost:8105 \
VEHICLE_URL=http://localhost:8106 \
USER_AUTO=http://localhost:3000 \
ADMIN_DESK=http://localhost:3001 \
JWT_SECRET=<your_secret_key> \
JWT_EXP=604800000 \
./gradlew bootRun --args='--spring.profiles.active=pprod'
```

### 🐳 Docker (Production)

Create a Dockerfile with the following contents:

```Dockerfile
# Stage 1: Build
FROM gradle:8.8-jdk21 AS build
WORKDIR /app
COPY gradlew gradlew.bat build.gradle settings.gradle /app/
COPY gradle/wrapper/ /app/gradle/wrapper/
COPY . /app/
RUN ./gradlew build --no-daemon -x test

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8102
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

Then build and run:

```bash
# Build the image
docker build -t api-gateway .

# Run the container with required environment variables
docker run -p 8102:8102 \
  -e PORT=8102 \
  -e AUTH_URL=http://host.docker.internal:8103 \
  -e LOGGING_URL=http://host.docker.internal:8104 \
  -e DISPATCH_URL=http://host.docker.internal:8105 \
  -e VEHICLE_URL=http://host.docker.internal:8106 \
  -e USER_AUTO=http://localhost:3000 \
  -e ADMIN_DESK=http://localhost:3001 \
  -e JWT_SECRET=<your_secret_key> \
  -e JWT_EXP=604800000 \
  api-gateway
```

---

## 📍 Gateway Routes

Routes are configured in `application.yml` or `application.pprod.yml`.

| ID                | Forwards To       | Handles Path                                                      |
| ----------------- | ----------------- | ----------------------------------------------------------------- |
| `authService`     | `${AUTH_URL}`     | `/v1/auth/admin/**`, `/v1/auth/user/**`                           |
| `loggingService`  | `${LOGGING_URL}`  | `/v1/user/notifications/**`, `/v1/sse/**`, `/v1/user/tracking/**` |
| `dispatchService` | `${DISPATCH_URL}` | `/v1/admin/dispatch/**`, `/v1/user/dispatch/**`                   |
| `vehicleService`  | `${VEHICLE_URL}`  | `/v1/admin/vehicle/**`, `/v1/user/vehicle/**`                     |

---

## 🔐 JWT Auth Filter

**Filter Class:** `JwtAuthenticationFilter.java`
**Purpose:** Intercepts all incoming requests (except auth/internal) and ensures they carry a valid JWT.

### 🧪 Token Resolution Order

1. **Authorization header** (`Bearer <token>`)
2. **For admins:** `adminDeskCookie`
3. **For users:** `userDeskToken` → fallback to `adminDeskCookie` if missing

### If token is valid:

* Parses the token using `JWT_SECRET`
* Extracts user email (`sub`)
* Adds the following headers:

    * `x-user-email`
    * `x-user-token`
* Forwards request downstream

### If token is missing/invalid:

* Returns a `401 Unauthorized` with a JSON error body

---

## 🔄 CORS Configuration

Set via `application.pprod.yml`.

**Allows requests from:**

* `${USER_AUTO}` (User Dashboard)
* `${ADMIN_DESK}` (Admin Panel)

**Allows:**

* All common methods (GET, POST, etc.)
* Authorization and CSRF headers
* Cookies (credentials)

---

## 🧪 Debugging / Logs

To enable verbose logging:

```yaml
logging:
  level:
    org.springframework.security: DEBUG
    com.example.UserService: DEBUG
```

Useful during token issues or permission debugging.

---

## 🧩 Helpful Files

| File                           | Description                                   |
| ------------------------------ | --------------------------------------------- |
| `JwtAuthenticationFilter.java` | Global JWT handler for gateway                |
| `application.yml`              | Default config for dev                        |
| `application.pprod.yml`        | Prod-ready config using environment variables |
| `build.gradle`                 | Gradle build script                           |
| `Dockerfile`                   | Docker build/run script                       |

---

## 🤝 Contributing

1. Fork and clone
2. Create a new branch
3. Follow code/commenting patterns
4. Submit PR with clear message

---

## 📜 License

MIT / Add license info here

---

## ✍️ Maintainers

* **Bright Akinola** (API Gateway Owner)
