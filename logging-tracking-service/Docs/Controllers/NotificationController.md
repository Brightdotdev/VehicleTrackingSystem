## 📝 Documentation: `NotificationController.md`

```markdown
# 📬 NotificationController

Manages **user notifications** in the AutoPort system. Exposes endpoints for:

- Marking notifications as read
- Retrieving all notifications for the current user

---

## 🔗 Base Path

```

/v1/user/notifications

````

---

## 🔧 Endpoints

### 📍 POST `/set-read`

**Marks a list of notifications as read** for a specific user.

#### 🔸 Request

**Query Param**:
- `user` (String): The username/email of the user

**Body**:
A list of notification records to mark as read:
```json
[
  { "notifId": "notif-123" },
  { "notifId": "notif-456" }
]
````

#### 🔸 Response

Returns a list of updated `NotificationDto` objects:

```json
{
  "status": "success",
  "code": 201,
  "message": "Notifications updated",
  "data": [
    {
      "notificationId": "notif-123",
      "title": "Dispatch Validated",
      "message": "Your request for ...",
      "receiver": "user@example.com",
      "isRead": true,
      ...
    }
  ]
}
```

#### 🔸 Errors

* `403 FORBIDDEN`: If the logged-in user and provided `user` do not match
* `404 NOT FOUND`: If a notification does not exist

---

### 📍 GET `/get-all-me`

**Fetches all notifications for the currently authenticated user.**

#### 🔸 Request

**Query Param**:

* `clientId` (String): Username/email (must match logged-in user)

#### 🔸 Response

```json
{
  "status": "success",
  "code": 201,
  "message": "Notifications received",
  "data": [
    {
      "id": "notif-123",
      "title": "Dispatch Validated",
      "message": "Your request for ...",
      "receiver": "user@example.com",
      "read": false,
      ...
    }
  ]
}
```

#### 🔸 Errors

* `403 FORBIDDEN`: If the `clientId` does not match the authenticated user

---

## ✅ Summary

| Action       | Endpoint          | Description                         |
| ------------ | ----------------- | ----------------------------------- |
| Mark as read | `POST /set-read`  | Marks notifications as read         |
| Fetch all    | `GET /get-all-me` | Fetch all of a user's notifications |

