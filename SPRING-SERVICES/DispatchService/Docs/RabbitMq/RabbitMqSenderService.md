

# 📤 RabbitMQ Sender Service (`RabbitMqSenderService.java`)

📁 `com.example.DispatchService.RabbitMq`

---

## ✅ Purpose

The `RabbitMqSenderService` handles **outbound events** to other microservices via RabbitMQ exchanges. It supports:

* 🔄 Synchronous request/response dispatch creation (via WebClient fallback)
* 📡 Asynchronous event fanouts (dispatch lifecycle broadcasts)

---

## 🎯 Responsibilities

| Type   | Event                    | Description                                         | Exchange Type          | Response |
| ------ | ------------------------ | --------------------------------------------------- | ---------------------- | -------- |
| Create | `dispatchRequestBodyDTO` | Ask vehicle service if dispatch is possible         | Direct (HTTP fallback) | ✅ Yes    |
| Fanout | `dispatchRequestBodyDTO` | Notify others that a dispatch was created           | Fanout                 | ❌ No     |
| Fanout | `DispatchEndedDTO`       | Notify when a dispatch ends (completed or canceled) | Fanout                 | ❌ No     |
| Fanout | `ValidatedDispatch`      | Notify when a dispatch is validated by admin        | Fanout                 | ❌ No     |

---

## 📦 Dependencies

```java
private final RabbitTemplate rabbitTemplate;
private final VehicleWebClientService vehicleWebClientService;
private final ResponseMapperService rabbitMqResponseMapper;
```

* `RabbitTemplate`: sends messages via AMQP
* `VehicleWebClientService`: fallback HTTP call to vehicle service
* `ResponseMapperService`: converts external responses into system-friendly DTOs

---

## 🧠 Method Breakdown

### 1️⃣ `sendDispatchCreatedEvent(...)`

```java
public Map<String, Object> sendDispatchCreatedEvent(dispatchRequestBodyDTO event, String cookieValue)
```

* 🧾 **Purpose**: Ask vehicle service (via HTTP fallback) if a dispatch can be made for the given vehicle
* 📡 Was previously using AMQP direct exchange but now uses `WebClient`
* 🧩 Result is passed to `ResponseMapperService.dispatchMapper(...)` to unify formats

```java
Object rawResponse = vehicleWebClientService.createNewWebClientDispatch(event, cookieValue).block();
return rabbitMqResponseMapper.dispatchMapper(rawResponse);
```

---

### 2️⃣ `sendDispatchCreatedEventNoResponse(...)`

```java
public void sendDispatchCreatedEventNoResponse(dispatchRequestBodyDTO event)
```

* ✅ Fire-and-forget **fanout broadcast**
* 🎯 Tells downstream services a dispatch was requested

---

### 3️⃣ `sendDispatchCompletedFanoutFromDispatchService(...)`

```java
public void sendDispatchCompletedFanoutFromDispatchService(DispatchEndedDTO event)
```

* ✅ Triggered when a dispatch ends (completed or canceled)
* 🎯 Broadcasts that dispatch is finished to logs, analytics, tracking, etc.

---

### 4️⃣ `sendDispatchValidatedNoResponse(...)`

```java
public void sendDispatchValidatedNoResponse(ValidatedDispatch event)
```

* ✅ Triggered when an admin validates a dispatch
* 🎯 Used by downstream services to begin provisioning or prep

---

## 📄 Pseudocode Summary

```text
IF dispatch request needs confirmation:
    Call vehicleWebClientService to get dispatch eligibility
    Return mapped response

IF fanout event (created/validated/completed):
    ConvertAndSend to appropriate fanout exchange
    Log outcome
```

---

## ⚠️ Validation Checks

Each method has:

* `null` checks on event or ID
* Logs warnings before rejecting
* Wraps failures in `try/catch` with full error logging

---

## 🧪 Example Logs

```log
[INFO] Dispatch completed event sent: DispatchEndedDTO(dispatchId=2023)
[WARN] Attempted to fanout null dispatch creation event
[ERROR] Failed to send dispatch validated event: NullPointerException
```

---

## 💡 Suggestions for Improvement

| Area             | Suggestion                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| Timeout Handling | Add fallback retry logic if `WebClient` fails or times out                 |
| Circuit Breaking | Integrate `Resilience4j` or `RetryTemplate` for resilience                 |
| Observability    | Tag logs with `dispatchId`, `vehicleId` for easier traceability            |
| Config Cleanup   | Move exchange/queue names to `application.yml` or a `Constants.java` class |

---

## 📎 Exchange Diagram

```text
 ┌──────────────┐               ┌────────────────────────┐
 │              │    Direct     │                        │
 │ Dispatch API ├──────────────▶│ Vehicle Service (Web)  │
 │              │              │                        │
 └────┬─────────┘              └────────────┬────────────┘
      │                                    │
      │ Fanout                             │
      ▼                                    ▼
┌────────────┐                  ┌─────────────────────┐
│ Logs       │◀────────────────│ Dispatch Completed   │
│ Tracking   │◀────────────────│ Dispatch Validated   │
│ Analytics  │◀────────────────│ Dispatch Created     │
└────────────┘                  └─────────────────────┘
```


