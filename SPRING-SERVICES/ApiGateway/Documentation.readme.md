
# API Gateway Service

This service is the **API Gateway** for the platform.  
It routes external requests to the appropriate microservices and applies global policies such as **CORS**, **JWT validation**, and **header deduplication**.  

It currently proxies requests to:

- **Auth Service** (`/v1/auth/admin/**`, `/v1/auth/user/**`, `/internal/auth/**`)
- **Logging Service** (`/v1/user/notifications/**`, `/v1/admin/notifications/**`, `/v1/sse/**`, `/v1/user/tracking/**`, `/internal/logs/**`)
- **Dispatch Service** (`/v1/admin/dispatch/**`, `/v1/user/dispatch/**`, `/internal/dispatch/**`)
- **Vehicle Service** (`/v1/admin/vehicle/**`, `/v1/user/vehicle/**`, `/internal/vehicles/**`)

---

## Configuration

The gateway has **two profiles**:

### 1. Development (`application.yml`)
- Hardcoded ports for local services (`http://localhost:8103`, `http://localhost:8104`, etc.)
- Allows local frontends (`http://localhost:3000`, `http://localhost:3001`)
- Use this when running everything locally for debugging

### 2. Production (`application.yml` with environment variables)
- All URLs and secrets are externalized as environment variables:
  - `AUTH_SERVICE_URL`, `LOGGING_SERVICE_URL`, `DISPATCH_SERVICE_URL`, `VEHICLE_SERVICE_URL`
  - `AUTO_PORT_URL`, `ADMIN_DESK_URL`
  - `API_INTERNAL_KEY`, `JWT_SECRET`, `JWT_EXP`
- Designed for **Docker Compose** or production deployment environments

---

## ⚠ Important Warning

This **API Gateway is useless without the other services**.  
Only run it standalone if the **Auth**, **Logging**, **Dispatch**, and **Vehicle** services are already running.  

- ✅ Use **Docker Compose** to run the entire system together (recommended).  
- ⚠ Run the gateway individually only for **debugging**.  

---

## Running the Gateway

### Option 1 — Run Entire System (Recommended)
Run everything (gateway + services) with Docker Compose from the project root:

```bash
docker compose up --build
````

This ensures all services are started and connected correctly.

---

### Option 2 — Run Only the Gateway (Debugging)

You can build and run just the API Gateway if the dependent services are already running elsewhere.

#### Build and run with Docker

```bash
docker build -t api-gateway .
docker run -p 8102:8102 \
  -e API_GATEWAY_PORT=8102 \
  -e AUTH_SERVICE_URL=http://host.docker.internal:8103 \
  -e LOGGING_SERVICE_URL=http://host.docker.internal:8104 \
  -e DISPATCH_SERVICE_URL=http://host.docker.internal:8105 \
  -e VEHICLE_SERVICE_URL=http://host.docker.internal:8106 \
  -e AUTO_PORT_URL=http://localhost:3000 \
  -e ADMIN_DESK_URL=http://localhost:3001 \
  -e API_INTERNAL_KEY=thisIsMyApiKey \
  -e JWT_SECRET=changeme \
  -e JWT_EXP=604800000 \
  api-gateway
```

---

### Option 3 — Run Locally with Gradle

If you prefer running outside Docker (e.g., during active development):

```bash
./gradlew bootRun
```

---

## Environment Variables (Production)

| Variable               | Description                       |
| ---------------------- | --------------------------------- |
| `API_GATEWAY_PORT`     | Port the gateway listens on       |
| `AUTH_SERVICE_URL`     | URL of the Auth Service           |
| `LOGGING_SERVICE_URL`  | URL of the Logging Service        |
| `DISPATCH_SERVICE_URL` | URL of the Dispatch Service       |
| `VEHICLE_SERVICE_URL`  | URL of the Vehicle Service        |
| `AUTO_PORT_URL`        | Allowed origin for user frontend  |
| `ADMIN_DESK_URL`       | Allowed origin for admin frontend |
| `API_INTERNAL_KEY`     | API key for internal requests     |
| `JWT_SECRET`           | Secret key for JWT signing        |
| `JWT_EXP`              | JWT expiration time (ms)          |

---

## Notes for Developers

* Use the **dev config (`application-dev.yml`)** when working locally with hardcoded URLs.
* Switch to **prod config** (`application.yml` with env vars) for Docker/Docker Compose.
* Always prefer `docker-compose` for real usage since the gateway depends on other services.
* Run the gateway alone only if debugging and the other services are already running.
