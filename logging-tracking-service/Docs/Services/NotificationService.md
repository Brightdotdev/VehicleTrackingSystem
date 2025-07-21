
# 📬 `NotificationService` — AutoPort Logging & Tracking

> 📁 `com.tracker.loggingtrackingservice.G.V1.Services.UserNotificationService`

This service handles **dispatch-related user notifications**, including creation, validation, completion, and status updates. It integrates with `NotificationRepository`, `UserHandler`, `TrackingService`, and `NotificationSseService`.

---

## 🛠️ Dependencies

| Dependency               | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `NotificationRepository` | Save and fetch notifications                 |
| `UserHandler`            | Retrieve the current authenticated user      |
| `TrackingService`        | Ends tracking on dispatch completion         |
| `NotificationSseService` | Sends SSE push notifications to users/admins |

---

## 📌 Method Breakdown

### 1. `sendCreatedDispatchNotification(dispatchEvent)`

Sends a notification to the **user** who requested a dispatch.

**Parameters:**

* `dispatchEvent`: `UtilRecords.dispatchRequestBodyDTO`

**Sends:**

* A notification stating that the dispatch is being processed.

**Used for:** Initial user feedback after a dispatch is created.

---

### 2. `sendCreatedDispatchNotificationsForAdmin(dispatchEvent)`

Sends a dispatch request notification to **admin(s)** for review.

**Parameters:**

* `dispatchEvent`: `UtilRecords.dispatchRequestBodyDTO`

**Sends:**

* A notification containing dispatch details (VIN, requester, reason, and end time).

---

### 3. `handleValidatedDispatchNotif(dispatchValidatedEvent)`

Sends a **validated dispatch** notification to the requester, including **action buttons**.

**Parameters:**

* `dispatchValidatedEvent`: `UtilRecords.ValidatedDispatch`

**Sends:**

* A user notification confirming validation.
* Includes **CTA** for: "Start Tracking" or "Cancel Dispatch".

---

### 4. `completedDispatchNotification(dispatchEvent)`

Sends a notification when a dispatch **ends or is canceled**, then stops tracking.

**Parameters:**

* `dispatchEvent`: `UtilRecords.DispatchEndedDTO`

**Logic:**

* If `wasCancelled == true`, notify about cancellation.
* Otherwise, notify about completion.

**Side Effect:**

* Calls `trackingService.stopTracking(dispatchEvent)` to stop tracking in DB.

---

### 5. `setNotificationToRead(notificationToRead, notifReader)`

Marks a list of notifications as **read** for a given user.

**Parameters:**

* `notificationToRead`: `List<UtilRecords.setReadRecord>`
* `notifReader`: `String` (expected user)

**Returns:**

* `List<UtilRecords.NotificationDto>` — Updated list of marked-as-read notifications.

**Validations:**

* Confirms `notifReader` matches the authenticated user.

---

### 6. `getAllMyNotifications(user)`

Fetches **all notifications** for a specific user.

**Parameters:**

* `user`: `String`

**Returns:**

* `List<NotificationModel>`

**Validations:**

* Confirms `user` matches the current authenticated user.

---

### 7. `handleDispatchTracking(trackingEvent)`

Sends a **tracking started** notification to the requester.

**Parameters:**

* `trackingEvent`: `UtilRecords.StartTrackingDTO`

**Purpose:**

* Alerts the user that tracking for their dispatch has begun.

---

## 🧠 Notes

* Each notification is persisted in the database before sending.
* **SSE Push** via `notificationEmitterService` allows live updates.
* DTOs used: `NotificationDto`, `dispatchRequestBodyDTO`, `ValidatedDispatch`, etc.
* Error handling is strict and uses custom exceptions: `AccessException`, `NotFoundException`, `InvalidTaskRequestException`.

---

## ✅ Summary of Notification Flow

```plaintext
1. Dispatch Created → sendCreatedDispatchNotification (User)
2. Dispatch Created → sendCreatedDispatchNotificationsForAdmin (Admin)
3. Dispatch Validated → handleValidatedDispatchNotif (User, with CTA)
4. Dispatch Completed → completedDispatchNotification (User + stop tracking)
5. User opens notifications → setNotificationToRead
6. User views all → getAllMyNotifications
7. Dispatch Tracking Started → handleDispatchTracking
```

---


