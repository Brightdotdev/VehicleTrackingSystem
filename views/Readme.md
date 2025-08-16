
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
