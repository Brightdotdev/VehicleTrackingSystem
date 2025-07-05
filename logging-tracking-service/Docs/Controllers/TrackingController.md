## 📝 Markdown Documentation — `TrackingController.md`

```markdown
# 🚚 Tracking Controller

This controller handles **starting, revalidating, and cancelling vehicle tracking**.

---

## 🔗 Base Path

```

/v1/user/tracking

```

---

## 📍 PUT `/revalidate/{dispatchId}`

Revalidates the last known location for a dispatch.

### 🔸 URL

```

PUT /v1/user/tracking/revalidate/{dispatchId}

````

### 🔸 Path Variables

| Name        | Type  | Description            |
|-------------|-------|------------------------|
| dispatchId  | Long  | ID of the dispatch     |

### 🔸 Request Body

```json
{
  "latitude": "6.5244",
  "longitude": "3.3792",
  "timeStamp": "2025-07-05T12:30:00"
}
````

### 🔸 Response

```json
{
  "vehicleIdentificationNumber": "ABC123",
  "dispatchRequester": "johndoe@example.com",
  ...
}
```

### 🔸 Description

Replaces the most recent checkpoint for a dispatch with a corrected one (e.g., from mobile GPS correction).

---

## 📍 PUT `/start/{dispatchId}`

Marks a dispatch as actively being tracked and sets the initial checkpoint.

### 🔸 URL

```
PUT /v1/user/tracking/start/{dispatchId}
```

### 🔸 Request Body

Same as `/revalidate`.

### 🔸 Response

Returns the `TrackingModel` for that dispatch.

### 🔸 Notes

* Must be called after the dispatch has been validated.
* Dispatch status will move to `IN_PROGRESS`.

---

## 📍 PUT `/cancel/{dispatchId}`

Marks the dispatch as **cancelled**.

### 🔸 URL

```
PUT /v1/user/tracking/cancel/{dispatchId}
```

### 🔸 Description

* Publishes a cancellation event.
* Sends user notification.
* Stops tracking in DB.

### 🔸 Response

```http
200 OK
```

---

## 🔄 Lifecycle Summary

| Action         | Endpoint               | Triggered Events                        |
| -------------- | ---------------------- | --------------------------------------- |
| Start tracking | `PUT /start/{id}`      | Tracking started, user notified         |
| Revalidate     | `PUT /revalidate/{id}` | Corrects last GPS point                 |
| Cancel         | `PUT /cancel/{id}`     | Notifies user, publishes RabbitMQ event |

---

## 📌 Tips

* Only authenticated users can call these routes.
* Make sure RabbitMQ listener is online to consume cancellation events.

---

## 🛡️ Future Improvements

| Idea              | Benefit                                       |
| ----------------- | --------------------------------------------- |
| Add authorization | Ensure users can only update their dispatches |
| Add Swagger docs  | Useful for testing and dev reference          |

