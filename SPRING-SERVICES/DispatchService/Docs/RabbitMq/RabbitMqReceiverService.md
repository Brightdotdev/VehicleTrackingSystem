
# 📥 RabbitMQ Receiver Service (`RabbitMqReceiverService.java`)

📁 `com.example.DispatchService.RabbitMq`

---

## ✅ Purpose

The `RabbitMqReceiverService` listens to **fanout queue broadcasts** from other services (e.g., **Logs Service**) and delegates those events to the appropriate internal handlers in `UserDispatchService`.

This allows for **asynchronous event-driven communication** between microservices in the system.

---

## 🔁 Subscribed Queues

| Queue Name                                                       | Event Type         | Source                | Handler Method                    |
| ---------------------------------------------------------------- | ------------------ | --------------------- | --------------------------------- |
| `completed.dispatch.fanOut.provider.logs.queue.service.dispatch` | `DispatchEndedDTO` | Logs Service          | `handleDispatchCompletedFromLogs` |
| `start.tracking.fanOut.provider.logs.queue.dispatch`             | `StartTrackingDTO` | Logs/Tracking Service | `handleDispatchTrackingQueue`     |

---

## 🔧 Dependencies

```java
private final UserDispatchService userDispatchService;
```

Delegates logic for handling dispatch state changes to the domain service layer.

---

## 🧠 Core Logic

### 🔹 Method 1: `handleDispatchCompletedFromLogs`

```java
@RabbitListener(queues = DISPATCH_COMPLETED_FROM_LOGS_QUEUE)
public void handleDispatchCompletedFromLogs(UtilRecords.DispatchEndedDTO dispatchEvent)
```

#### ✅ Purpose:

Updates a user's dispatch to `COMPLETED` when a "dispatch ended" event is received.

#### 🧾 Validation:

* Checks if the event or `dispatchId` is `null` and logs a warning if invalid.

#### 🛠️ Action:

* Calls `userDispatchService.completeDispatch(dispatchEvent)`
* Logs and suppresses exceptions (to avoid consumer crash)

---

### 🔹 Method 2: `handleDispatchTrackingQueue`

```java
@RabbitListener(queues = DISPATCH_TRACKING_FROM_LOGS_QUEUE)
public void handleDispatchTrackingQueue(UtilRecords.StartTrackingDTO trackingEvent)
```

#### ✅ Purpose:

Transitions a dispatch to `IN_PROGRESS` when tracking begins.

#### 🧾 Validation:

* Checks if the event or `dispatchId` is `null` and logs a warning if invalid.

#### 🛠️ Action:

* Calls `userDispatchService.handleDispatchTracking(trackingEvent)`
* Logs and suppresses any processing exceptions

---

## 📄 Pseudocode Summary

```text
ON message FROM "completed.dispatch.fanOut.provider.logs.queue.service.dispatch":
    IF dispatchEvent is valid:
        call userDispatchService.completeDispatch(dispatchEvent)
    ELSE:
        log warning

ON message FROM "start.tracking.fanOut.provider.logs.queue.dispatch":
    IF trackingEvent is valid:
        call userDispatchService.handleDispatchTracking(trackingEvent)
    ELSE:
        log warning
```

---

## 🧼 Best Practices Observed

* ✅ Defensive null checks
* ✅ Scoped exception logging (avoids halting consumer loop)
* ✅ Separation of concerns (delegates to service layer)
* ✅ Annotated with `@Transactional` to ensure atomic DB updates

---

## 📌 Suggestions for Improvement

| Area          | Suggestion                                                                    |
| ------------- | ----------------------------------------------------------------------------- |
| Logging       | Include dispatch ID in success logs for better traceability                   |
| Retry         | Consider retry mechanisms (e.g., DLQ or Spring Retry) for transient failures  |
| Observability | Add metrics/logs for successful event handling too (not just errors)          |
| Validation    | Validate more fields inside the DTO if required (e.g., vehicle ID, timestamp) |

---

## 🧪 Example Logs

```log
[INFO] Received DispatchEndedDTO from Logs - ID: 1202, Reason: Completed
[WARN] Received invalid dispatchCompleted event: null
[ERROR] Error processing startTracking event: Dispatch not found
```

---
