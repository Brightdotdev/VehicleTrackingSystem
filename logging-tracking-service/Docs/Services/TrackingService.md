# 🚚 `TrackingService` — Dispatch & Vehicle Tracking

> 📁 `com.tracker.loggingtrackingservice.G.V1.Services.TrackingService`

This service manages the entire lifecycle of **dispatch tracking**, from validation to position updates to termination. It also handles **event publishing** using RabbitMQ fanout patterns.

---

## 🧩 Responsibilities

| Area      | Details                                              |
| --------- | ---------------------------------------------------- |
| ✅ Create  | Save new dispatch tracking when validated            |
| 🚦 Start  | Begin real-time tracking with coordinates            |
| 📍 Update | Continuously revalidate and log checkpoints          |
| 🛑 Stop   | Mark a dispatch as completed or cancelled            |
| 📬 Events | Push events to RabbitMQ for system-wide notification |

---

## 📦 Dependencies

| Dependency               | Role                                       |
| ------------------------ | ------------------------------------------ |
| `RabbitMqSenderService`  | Publishes events: start, update, complete  |
| `TrackingRepository`     | Fetches and stores `TrackingModel` entries |
| `NotificationRepository` | Injected but unused (consider removing)    |

---

## 🔧 Core Methods

---

### 🔹 `TrackingModel revalidateTrackingPosition(Long dispatchId, CheckPoint checkPoint)`

Revalidates the current position of a dispatch, adds the previous location to checkpoint history, and pushes updates via RabbitMQ.

**Side Effects:**

* Marks dispatch as **COMPLETED** if past end time.
* Sends:

    * `DispatchEndedDTO` to `sendCompletedDispatchFanOut`
    * `vehicleLocationUpdate` to `sendTrackingCheckPointFanOut`

---

### 🔹 `TrackingModel startTracking(Long dispatchId, CheckPoint checkPoint)`

Begins tracking a validated dispatch if it's eligible.

**Steps:**

1. Ensure tracking status isn't already `IN_PROGRESS`, `COMPLETED`, or `CANCELLED`.
2. Pushes:

    * `StartTrackingDTO` to `sendTrackingInitializationFanout`
    * `vehicleLocationUpdate` to `sendTrackingCheckPointFanOut`

---

### 🔹 `void stopTracking(DispatchEndedDTO dispatchEvent)`

Marks a dispatch as `COMPLETED` or `CANCELLED`, updates end time, and pushes a fanout event.

---

### 🔹 `TrackingModel findByDispatchId(Long dispatchID)`

Returns an existing dispatch tracking by ID or throws `NotFoundException`.

---

### 🔹 `void handleValidatedDispatchTracking(ValidatedDispatch dispatchValidatedEvent)`

Creates a new `TrackingModel` from a validated dispatch and saves it with initial status as `PENDING`.

---

## 🧪 Internal Utility

---

### 🔸 `boolean isValidToTrack(TrackingModel model)`

Returns `true` if dispatch is **trackable**, otherwise throws `ConflictException`:

| Invalid Status | Error              |
| -------------- | ------------------ |
| `IN_PROGRESS`  | Already tracking   |
| `COMPLETED`    | Tracking ended     |
| `CANCELLED`    | Not valid to begin |

---

## 📤 Event Publishing (via RabbitMQ)

| Event                              | DTO                     | Triggered In                                  |
| ---------------------------------- | ----------------------- | --------------------------------------------- |
| `sendTrackingInitializationFanout` | `StartTrackingDTO`      | `startTracking`                               |
| `sendTrackingCheckPointFanOut`     | `vehicleLocationUpdate` | `startTracking`, `revalidateTrackingPosition` |
| `sendCompletedDispatchFanOut`      | `DispatchEndedDTO`      | `stopTracking`, `revalidateTrackingPosition`  |

---

## ✅ Summary

```plaintext
- Validated dispatch → handleValidatedDispatchTracking()
- User starts tracking → startTracking()
- System gets updated GPS → revalidateTrackingPosition()
- Time expires or user ends → stopTracking()
```


