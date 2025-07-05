

# 🚗📍 Vehicle Tracking System

Welcome to the Vehicle Tracking System — a microservices-powered platform designed to help car companies track, manage, and evaluate vehicle dispatches **in real time** with safety-first enforcement.

---

## 🧭 What This Is

This system helps companies:

- Monitor vehicle conditions and movements live
- Enforce strict safety rules for dispatching vehicles
- Track dispatch activity historically
- Communicate between services via **RabbitMQ**
- Access updates through **WebSocket (SSE)** streams
- Use a single entry point through the **API Gateway**

---

## 💡 Project Structure

```bash
/views                       -> Frontend (React app)
/AuthService/Docs           -> Auth microservice documentation
/VehicleService/Docs        -> Vehicle info and scoring Docs
/DispatchService/Docs       -> Dispatch creation and rules
/logging-tracking-service/Docs -> Tracking logs, SSE notifications
/ApiGateway/Docs            -> Gateway routing and config
````

> 📌 Each backend service contains its own `/Docs` folder. Please check these folders for service-specific setup, endpoints, and notes.

---

## 🛠️ Technologies Used

### 🔧 Backend

* Java 17+
* Spring Boot
* Spring Cloud Gateway
* RabbitMQ (for event-driven communication)
* SSE (Server-Sent Events for real-time updates)

### 🎨 Frontend

* React
* TailwindCSS (optional)

### ⚙️ DevOps

* Docker (multi-stage builds and networking)
* Docker Compose (recommended)

---

## 🚦 Safety Score Rules

Each vehicle is assigned a **safety score** calculated from current part conditions:

| Score   | Status                  |
| ------- | ----------------------- |
| `>= 63` | ✅ Eligible for dispatch |
| `< 63`  | ❌ Blocked from dispatch |

Vehicles **cannot be dispatched** if their safety score is below 63. This is automatically enforced by the Dispatch Service.

---

## 🔄 Real-Time Features

Users and admins can subscribe to SSE endpoints for:

* Dispatch status changes (created, started, completed, cancelled)
* Vehicle checkpoint/location updates
* User/admin-specific notification streams

---

## ⚙️ Running the Backend (🚨 Order Matters)

> This is a modular microservices system. You **must** start components in the correct order for everything to work properly.

### 1. 🐰 Start RabbitMQ

Use Docker to start RabbitMQ with UI access and credentials:

```bash
docker run -d --hostname my-rabbit --name rabbitmq \
  -e RABBITMQ_DEFAULT_USER=bright \
  -e RABBITMQ_DEFAULT_PASS=secret123 \
  -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

* RabbitMQ UI Dashboard: [http://localhost:15672](http://localhost:15672)
* Username: `bright`
* Password: `secret123`

---

### 2. 🚀 Start Backend Services in This Order

```bash
1️⃣ AuthService
2️⃣ VehicleService
3️⃣ DispatchService
4️⃣ logging-tracking-service
5️⃣ api-gateway (start this LAST)
```

> 🧠 The API Gateway only proxies requests. It **won’t work** unless the above services are up first.

---

## 🌐 Frontend Setup

All frontend code lives in the [`/views`](./views) directory.

* Built with **React**
* Communicates with backend services **via the API Gateway**
* Real-time features like live vehicle updates and notifications are supported

> ⚠️ Make sure your backend services are running before starting the frontend.

---

## 📚 Need Help?

Each service includes a `/Docs` folder with:

* API endpoints
* Setup instructions
* Example requests
* Notes on configuration and usage

If something isn't working, check the related service’s documentation first.

---

## ❤️ Why This Exists

We built this to help logistics and car companies:

* Improve fleet safety
* Enforce dispatch policies
* Track vehicle activity across dispatch lifecycles
* Deliver real-time visibility to operators and admins

---

## 👋 Final Notes

Thanks for exploring this project! 🙏
If you're running it locally for the first time:

* RabbitMQ may take **a few seconds** to start
* Make sure your services are up **in order**
* You’ll see real-time tracking and notification events once everything connects

---

💻 Made with grit, patience, and a great team lmao
Happy shipping! 🚚📦

