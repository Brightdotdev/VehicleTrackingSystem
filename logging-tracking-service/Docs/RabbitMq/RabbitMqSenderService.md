## 🚀 `RabbitMqSenderService` Documentation

> **Purpose:**
> This service handles **sending messages** to RabbitMQ exchanges to broadcast events like dispatch completion, tracking start, and vehicle location updates using the **Fanout** exchange pattern.

---

### ⚙️ Dependencies

* `RabbitTemplate`: Spring abstraction for publishing messages to RabbitMQ.
* `Logger (SLF4J)`: For logging successful/failed message publishing attempts.

---

### 📬 Exchanges Used

| Exchange Name                              | Event Purpose                                            |
| ------------------------------------------ | -------------------------------------------------------- |
| `completed.dispatch.fanOut.provider.logs`  | Notify services that a dispatch is complete or cancelled |
| `start.tracking.fanOut.provider.logs`      | Notify services that a dispatch tracking has started     |
| `tracking.checkPoint.fanOut.provider.logs` | Broadcast periodic vehicle location updates              |

**Note:** All are **fanout** exchanges — no routing key is needed.

---

### 📦 Message Publisher Methods

#### ✅ `sendCompletedDispatchFanOut(...)`

Publishes a `DispatchEndedDTO` when a dispatch is marked completed or cancelled.

```java
public void sendCompletedDispatchFanOut(UtilRecords.DispatchEndedDTO event)
```

* **Exchange:** `completed.dispatch.fanOut.provider.logs`
* **Validation:** `event` and `dispatchId` must not be `null`.
* **Failure handling:** Logs and swallows exception.

---

#### ✅ `sendTrackingInitializationFanout(...)`

Publishes a `StartTrackingDTO` when a dispatch begins tracking.

```java
public void sendTrackingInitializationFanout(UtilRecords.StartTrackingDTO event)
```

* **Exchange:** `start.tracking.fanOut.provider.logs`
* **Validation:** `event` and `dispatchId` must not be `null`.

---

#### ✅ `sendTrackingCheckPointFanOut(...)`

Broadcasts periodic vehicle location updates (checkpoints) using `vehicleLocationUpdate`.

```java
public void sendTrackingCheckPointFanOut(UtilRecords.vehicleLocationUpdate event)
```

* **Exchange:** `tracking.checkPoint.fanOut.provider.logs`
* **Validation:** `event` and `vehicleIdentificationNumber` must not be `null`.

---

### 🔐 Error Logging

Each method logs a warning if input is invalid and logs an error if the message fails to send due to runtime exceptions.

Example:

```bash
❌ Failed to send tracking initialization event: <error_message>
```

---

### ✅ Summary

This service acts as the **outgoing messaging gateway** for the logging/tracking microservice. It sends:

* Dispatch status changes,
* Tracking start signals,
* Checkpoint/location updates,

to other microservices in the system using fanout messaging. It ensures **resilience** via logging and fail-silently strategies for transient message errors.

---
