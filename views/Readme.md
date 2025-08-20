
## 🖥️ Frontend Build & Run (Manual)

> Note: The frontend is **not pre-built** in this repo. Developers must build it themselves to run locally.

### 🔹 Steps

1. Navigate to the frontend subdirectory:

```bash
cd VIEWS/user_auto_port_web  #for the users
cd VIEWS/admin_desk_web #for the admin
````

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Or build the frontend for production:

```bash
npm run build
```

5. Access locally:

* **User UI** → `http://localhost:3001` (`USER_AUTO_PORT`)
* **Admin UI** → `http://localhost:3000` (`ADMIN_DESK_WEB`)

---

### ⚠️ Important Notes

* The **frontend must point to the API Gateway** for backend requests.
* If you want to debug locally, make sure:

  1. All backend services are running (Auth, Vehicle, Dispatch, Logging).
  2. The API Gateway is running
* The frontend **will not work** without the backend services.
* Recommended approach: use **Docker Compose** to start backend + gateway + optional RabbitMQ, then run frontend dev server separately if needed.

---

### 🔧 Quick Tip

```text
# For local debugging
Start backend: docker compose up --build
Run frontend dev server: npm run dev (inside /views)
```

This gives you a **parallel dev capability** while keeping services isolated but functional.




Got it 👍 — you want a section in your **docs/README** that explains how to **run each backend Spring Boot service individually for debugging**, without relying on Docker Compose. That way devs can start only the service they care about, check logs directly, and avoid waiting for everything to spin up.

Here’s a markdown draft you can drop into your docs:

---

## ⚙️ Backend Services (Manual Debug Mode)

Normally, backend services are orchestrated using **Docker Compose**, but for **debugging** or faster local testing, you can run each service individually.

### 🔹 Steps

1. Navigate to the respective service’s root directory (inside the `spring-services` folder):

```bash
cd spring-services/ApiGateway
cd spring-services/AuthService
cd spring-services/VehicleService
cd spring-services/DispatchService
cd spring-services/LoggingTrackingService
```

2. Build the service (skipping tests if needed):

```bash
gradle build --no-daemon -x test
```

3. Run the service directly with Java:

```bash
java -jar build/libs/<SERVICE_NAME>-0.0.1-SNAPSHOT.jar
```

For example:

```bash
# API Gateway
cd spring-services/ApiGateway
gradle build --no-daemon -x test
java -jar build/libs/ApiGateway-0.0.1-SNAPSHOT.jar

# Auth Service
cd spring-services/AuthService
gradle build --no-daemon -x test
java -jar build/libs/AuthService-0.0.1-SNAPSHOT.jar

# Vehicle Service
cd spring-services/VehicleService
gradle build --no-daemon -x test
java -jar build/libs/VehicleService-0.0.1-SNAPSHOT.jar

# Dispatch Service
cd spring-services/DispatchService
gradle build --no-daemon -x test
java -jar build/libs/DispatchService-0.0.1-SNAPSHOT.jar

# Logging/Tracking Service
cd spring-services/logging-tracking-service
gradle build --no-daemon -x test
java -jar build/libs/logging-tracking-service-0.0.1-SNAPSHOT.jar
```

---

### 🔎 Debugging & Logs

* Running services this way lets you **see logs directly** in your terminal.
* Useful for debugging endpoints, database queries, and inter-service communication.
* You can choose to run **only the service you are debugging** instead of waiting for Docker Compose to start all of them.

---

### ⚠️ Notes

* Some services depend on others (e.g., API Gateway expects all the services to be available,the auth service(for admin) needs the logging service to be available too).
* If you only want to debug one service in isolation, you might need to **mock external calls** or disable service discovery.
* For full stack debugging (all services + frontend), Docker Compose is still the recommended approach.
