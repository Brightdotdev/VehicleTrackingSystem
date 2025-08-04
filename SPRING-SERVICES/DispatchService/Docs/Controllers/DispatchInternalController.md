


# 🔧 `DispatchInternalController`

📁 `com.example.DispatchService.Controller`

## ✅ Purpose

Exposes **internal-only**, **non-authenticated** endpoints for other **microservices** or **event bridges** to trigger **dispatch completions** or **start tracking** events programmatically (typically as backups for RabbitMQ failures or fallbacks).

---

## 🛡️ Endpoint Base Path

```java
@RequestMapping("/api/internal/dispatch")
```

> This makes all routes start with:

```
/api/internal/dispatch
```

---

## 🧩 Dependencies Injected

```java
private final UserDispatchService userDispatchService;
```

Used to process tracking and completion business logic directly.

---

## 📦 Endpoints

### 🔚 `/complete` – Mark Dispatch as Completed

```java
@PostMapping("/complete")
public ResponseEntity<ApiResponse<String>> handleDispatchCompletedFromLogs(
        @Valid @RequestBody UtilRecords.DispatchEndedDTO dispatchEvent
)
```

* **Triggers the same logic** as the RabbitMQ listener from `RabbitMqReceiverService`
* Used when message queue fails or retry fallback needs a direct call
* Handles errors gracefully, logs them internally
* Responds with `ApiResponse<String>` message

📘 **Request Body**

```json
{
  "dispatchId": 123,
  "receiver": "user1",
  "vehicleName": "Truck",
  "vehicleId": "VIN123",
  "timeStamp": "2025-07-05T16:00:00Z",
  "userCompleted": true
}
```

---

### 🚦 `/track` – Start Dispatch Tracking

```java
@PostMapping("/track")
public ResponseEntity<ApiResponse<String>> handleDispatchTrackingQueue(
        @Valid @RequestBody UtilRecords.StartTrackingDTO trackingEvent
)
```

* Triggers `handleDispatchTracking()` in `UserDispatchService`
* Changes dispatch status to `IN_PROGRESS` and sets start time
* Also mimics RabbitMQ event processing fallback
* Good for manually initiating tracking if queues are down

📘 **Request Body**

```json
{
  "dispatchId": 123
}
```

---

## 🔄 Pseudocode

```text
POST /complete
→ If invalid event → return 403 error
→ Else → call userDispatchService.completeDispatch()
→ return 200 success or 500 if error

POST /track
→ If invalid event → return 403 error
→ Else → call userDispatchService.handleDispatchTracking()
→ return 200 success or 500 if error
```

---

## 🛡️ Security Assumptions

* These endpoints should be **firewalled** or **gateway-restricted** (e.g., with internal mTLS or IP whitelisting).
* Should not be public-facing since they lack authentication guards (`@PreAuthorize` not used).

---

## ✅ Suggested Improvements

| Area        | Suggestion                                                             |
| ----------- | ---------------------------------------------------------------------- |
| 🔐 Security | Add internal-only annotation or restrict with API Gateway/mTLS         |
| 🧼 Response | Set `data` to a message like `"completed"` instead of `null`           |
| 🚨 Logging  | Add request ID or trace ID for debugging if accessed externally        |
| 📚 Docs     | Add Swagger `@Operation` annotations (hidden from public docs ideally) |


