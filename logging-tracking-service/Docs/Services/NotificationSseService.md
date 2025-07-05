
# 🌐 `NotificationSseService` — SSE Push Notifications (AutoPort)

> 📁 `com.tracker.loggingtrackingservice.G.V1.Services.NotificationSseService`

This service manages **live Server-Sent Events (SSE)** for real-time notification delivery to users and admins.

---

## 🧩 Responsibilities

* Handles SSE **subscriptions** via `SseEmitter`.
* Manages connected clients in memory via `ConcurrentHashMap`.
* Sends custom **user/admin notifications** with different event names.
* Auto-removes clients on **timeout, disconnect, or error**.

---

## 📦 Dependencies

| Dependency                              | Purpose                                              |
| --------------------------------------- | ---------------------------------------------------- |
| `AdminRepository`                       | Retrieves all registered admins                      |
| `ConcurrentHashMap<String, SseEmitter>` | Stores active SSE clients                            |
| `SseEmitter`                            | Spring abstraction for server-sent event connections |

---

## 🔧 Fields

| Field             | Type                                    | Description                          |
| ----------------- | --------------------------------------- | ------------------------------------ |
| `emitters`        | `ConcurrentHashMap<String, SseEmitter>` | Tracks all active client connections |
| `DEFAULT_TIMEOUT` | `Long`                                  | Connection timeout (30 mins)         |

---

## 🔌 Method Overview

### 1. `SseEmitter subscribe(String clientId)`

> Subscribes a **user or admin** to the SSE stream using their email/ID.

**Parameters:**

* `clientId` – email or identifier used to track emitter.

**Returns:** `SseEmitter` instance

**Side Effects:**

* Sends initial `"INIT"` event to confirm connection.
* Registers lifecycle cleanup callbacks:

    * `onCompletion`, `onTimeout`, and `onError` → removes client.

---

### 2. `sendUserNotification(String email, NotificationDto notificationData)`

> Sends a **generic user notification** via SSE.

**Event Name:** `USER_NOTIFICATION`

**Parameters:**

* `email`: user identifier
* `notificationData`: `NotificationDto` payload

---

### 3. `sendUserDispatchNotification(String email, NotificationDto notificationData)`

> Sends a **dispatch-specific** notification to a user.

**Event Name:** `DISPATCH_USER_NOTIFICATION`

---

### 4. `sendAdminNotification(String adminId, NotificationDto notificationData)`

> Sends a **direct notification** to a specific admin.

**Event Name:** `ADMIN_NOTIFICATION`

---

### 5. `sendAdminsNotification(NotificationDto notificationData)`

> Broadcasts a notification to **all admins** retrieved from DB.

**Steps:**

1. Get all `AdminModel` entries from `AdminRepository`.
2. For each admin:

    * If emitter is open, send `ADMIN_NOTIFICATION`.

---

## ✅ Summary

```plaintext
User/Admin connects → subscribe(clientId)
  ↳ Receives INIT event

Dispatch/Event occurs → sendXNotification(...)
  ↳ Receives real-time push notification via SSE

If disconnected → emitter auto-cleaned from memory
```

---

## 🧠 Notes

* SSE is **one-way (server-to-client)** and lightweight compared to WebSockets.
* You’ve separated user vs dispatch vs admin event types — great for frontend filtering!
* Consider adding a heartbeat/ping for long-lived connections in production.


