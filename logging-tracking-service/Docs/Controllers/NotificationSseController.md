## 📝 Documentation — `NotificationSseController.md`

```markdown
# 🔔 Notification SSE Controller

This controller provides an **SSE (Server-Sent Events)** endpoint that clients can connect to in order to receive **real-time notifications**.

---

## 🔗 Base Path

```

/v1/sse

```

---

## 📍 Endpoint: `GET /subscribe`

Subscribes the currently authenticated user to receive real-time notifications via SSE.

### 🔸 URL

```

GET /v1/sse/subscribe

````

### 🔸 Request

- **Headers**:
  - `Authorization: Bearer <JWT>` — required
- **No Body or Params** — user is inferred from security context via `UserHandler`

### 🔸 Response

- **Media Type**: `text/event-stream`
- Opens a persistent connection and streams JSON SSE events like:

```plaintext
event: INIT
data: {"message": "Connected to notification stream."}

event: USER_NOTIFICATION
data: {
  "notificationId": "notif-123",
  "title": "Dispatch Request",
  "message": "Your vehicle for DELIVERY has been validated.",
  ...
}
````

---

## 🔄 Supported Event Types

| Event Name                   | Description                              |
| ---------------------------- | ---------------------------------------- |
| `INIT`                       | Sent immediately upon connection         |
| `USER_NOTIFICATION`          | Standard user notification               |
| `DISPATCH_USER_NOTIFICATION` | Notifications tied to dispatch events    |
| `ADMIN_NOTIFICATION`         | Broadcast notifications to admin clients |

---

## 🔁 Reconnection Strategy

Clients (e.g., frontend) should reconnect if the SSE connection drops. Use the `Last-Event-ID` header to resume if needed.

---

## ✅ Use Case Summary

| Use Case                             | Endpoint                |
| ------------------------------------ | ----------------------- |
| Subscribe to real-time notifications | `GET /v1/sse/subscribe` |

---

## 🛡️ Security

* Only authenticated users can subscribe.
* `UserHandler.getCurrentUser()` resolves the user from the JWT/session.
* SSE is **one-way communication** (server → client only).

---

## 📌 Tips for Frontend Integration

* Use EventSource API in JavaScript:

```js
const source = new EventSource("http://localhost:8104/v1/sse/subscribe");

source.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log("Notification:", data);
};

source.addEventListener("USER_NOTIFICATION", function(event) {
  const data = JSON.parse(event.data);
  showNotification(data);
});
```


