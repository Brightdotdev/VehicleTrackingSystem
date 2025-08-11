
# 🚗📍 Vehicle Tracking System

[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

Welcome to the Vehicle Tracking System — a **microservices-powered** platform for tracking, managing, and evaluating vehicle dispatches in real time with a safety-first approach.

---

## 🧭 What This Is

This system helps companies:

* Monitor vehicle conditions and movements
* Enforce safety rules for dispatching vehicles
* Keep a history of dispatch activity
* Communicate between services using **RabbitMQ** *or* **pure WebClient calls**
* Retrieve notifications via **polling**

---

## 💡 Project Structure

```bash
/views                       -> Frontend (React apps: admin + user)
/AuthService/Docs            -> Auth microservice documentation
/VehicleService/Docs         -> Vehicle info and scoring Docs
/DispatchService/Docs        -> Dispatch creation and rules
/logging-tracking-service/Docs -> Tracking logs, notifications
/ApiGateway/Docs             -> Gateway routing and config
```

📌 Each backend service contains its own `/Docs` folder. Please check these folders for service-specific setup, endpoints, and notes.

---

## 🛠️ Technologies Used

### 🔧 Backend

* Java 17+
* Spring Boot
* Spring Cloud Gateway
* RabbitMQ (optional — can be replaced with direct `WebClient` calls)

### 🎨 Frontend

* React
* TailwindCSS (optional)

### ⚙️ DevOps

* Docker (multi-stage builds and networking)
* Docker Compose (recommended)
* Single Postgres container hosting **multiple databases**

---

## 🚦 Safety Score Rules

Each vehicle is assigned a **safety score** calculated from part conditions:

| Score   | Status                  |
| ------- | ----------------------- |
| `>= 63` | ✅ Eligible for dispatch |
| `< 63`  | ❌ Blocked from dispatch |

The Dispatch Service automatically blocks unsafe vehicles from being dispatched.

---

## 🔄 Notification Flow


* Notifications are retrieved by **polling endpoints** at intervals.
---

## Messaging 

* Developers can choose:
  1. **RabbitMQ-based events** for faster async communication, **or**
  2. **Direct WebClient calls** for a simpler setup.



## ⚙️ Running the Backend

The system now uses **one Postgres container** for all databases.
An `init.sql` script creates each database and its user automatically.

---

### 🐳 Quick Start

#### 1. Create your `.env`

Copy `.env.example` and set credentials, ports, and API keys.

> ⚠ **Security Warning:**
> Never commit `.env` to GitHub or any public repo — it contains credentials.
> Add `.env` to `.gitignore`.

---

#### 2. Start everything with Docker Compose

From the root directory:

```bash
docker compose up --build
```

This will start:

* **Postgres** (with all DBs pre-created)
* **MongoDB** for logging
* **RabbitMQ** *(optional — only if you want event-driven mode)*
* All microservices (Auth, Dispatch, Vehicle, Logging)
* API Gateway

---

#### 3. Access UIs

* **pgAdmin** → [http://localhost:5050](http://localhost:5050)
* **Mongo Express** → [http://localhost:8081](http://localhost:8081)
* **RabbitMQ UI** *(optional)* → [http://localhost:15672](http://localhost:15672)
* **API Gateway** → Port from `.env` (default `8102`)
* **Frontend Admin UI** → [http://localhost:3000](http://localhost:3000)
* **Frontend User UI** → [http://localhost:3001](http://localhost:3001)



>  **Info**
> Each of the services have their own seperate docmenation on how each of them work under the hood
> (incase you where wondering where the url of the services are)
---


## 🔀 Switching Between RabbitMQ and WebClient

You can change the communication mode between services via the `.env` file.

Look for the `*_MESSAGE_TYPE` variables in `.env` for each service:

```env
MESSAGE_TYPE=rabbitMq      # Use 'rabbitMq' for RabbitMQ

**To switch to WebClient (no RabbitMQ)**:

* Change all `*_MESSAGE_TYPE` values to `webClient`
* You can also stop the RabbitMQ container from `docker-compose.yml` if you’re not using it

Example:

```env
MESSAGE_TYPE=webClient
```

---



````md
## 🐇 Running With or Without RabbitMQ

By default, the system runs **without RabbitMQ** (using WebClient calls between services).  
To enable RabbitMQ and event-driven mode:

```bash
docker compose --profile rabbitmq up --build
````

If you want to run without RabbitMQ:

```bash
docker compose up --build
```

Make sure `.env` is configured with:

```env
MESSAGE_TYPE=rabbitMq   # to run with rabbit mq else just use web client
```


## 🌐 Frontend Setup

Frontend lives in [`/views`](./views) and:

* Uses the API Gateway for backend access
* Polls backend endpoints for notifications
* Supports RabbitMQ-based or WebClient-based backend communications

---

## 📚 Service Documentation

Each service has a `/Docs` folder with:

* Endpoints
* Config options
* Example requests
* Integration notes

---

## ❤️ Why This Exists

We built this to help logistics and automotive companies:

* Improve fleet safety
* Enforce dispatch policies
* Track vehicle activity
* Provide real-time awareness (polling or RabbitMQ-driven)

---

## 🔐 License & Ownership

Licensed under the
**Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International Public License**
(CC BY-NC-ND 4.0)
🔗 [https://creativecommons.org/licenses/by-nc-nd/4.0/](https://creativecommons.org/licenses/by-nc-nd/4.0/)

---

## ⚠ Group Project Note

This was built as part of a final academic group project.
Core system design and code by **[Brightdotdev](https://github.com/Brightdotdev)**.

---

## 🙋 Contact

* 📧 Email: [iamtherealbright@gmail.com](mailto:iamtherealbright@gmail.com)
* 🐙 GitHub: [https://github.com/Brightdotdev](https://github.com/Brightdotdev)
* 💼 LinkedIn: [https://www.linkedin.com/in/brightdotdev/](https://www.linkedin.com/in/brightdotdev/)

---

💻 Made with grit, patience, and a choice between queues or straight-up HTTP calls

---





