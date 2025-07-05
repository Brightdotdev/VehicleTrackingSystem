## 📦 `RabbitMqReceiverService` Documentation

> **Purpose:**
> This service listens to incoming RabbitMQ messages from various queues and triggers appropriate side effects in the system (like creating notifications, tracking events, or saving admins).

---

### ✅ Overview of Listeners

| Queue Name                                                               | Purpose                                              |
| ------------------------------------------------------------------------ | ---------------------------------------------------- |
| `logs.service.created.admin.queue`                                       | Listens for newly created admins from other services |
| `log.service.dispatch.created.fanout.queue`                              | Listens when a new dispatch is created               |
| `completed.dispatch.fanOut.provider.dispatch.service.queue.logs.service` | Listens when a dispatch is completed or canceled     |
| `validated.dispatch.fanOut.provider.dispatch.service.queue.logs.service` | Listens when a dispatch is validated                 |
| `start.tracking.fanOut.provider.logs.queue.logs`                         | Listens when a dispatch starts being tracked         |

---

### 🔁 Listener Methods

#### 🧑‍💼 `handleAdminCreatedQueue(...)`

**Triggered by:** `logs.service.created.admin.queue`
**Responsibility:**

* Save new admin if not already existing.
* Return a response map `{createdNew: true/false}`.

```java
@RabbitListener(queues = ADMIN_CREATED_DIRECT_EXCHANGE_QUEUE)
public Map<String, Object> handleAdminCreatedQueue(UtilRecords.adminCreatedRequestBodyDto requestBody)
```

---

#### 🚛 `handleDispatchCreatedNotification(...)`

**Triggered by:** `log.service.dispatch.created.fanout.queue`
**Responsibility:**

* Notify the user who made the request.
* Notify all admins.

```java
@RabbitListener(queues = DISPATCH_CREATED_FANOUT_LOG_QUEUE)
public void handleDispatchCreatedNotification(UtilRecords.dispatchRequestBodyDTO event)
```

---

#### ✅ `handleDispatchCompleted(...)`

**Triggered by:** `completed.dispatch.fanOut.provider.dispatch.service.queue.logs.service`
**Responsibility:**

* Notify the user that the dispatch is completed or cancelled.

```java
@RabbitListener(queues = DISPATCH_COMPLETED_FANOUT_LOGS_QUEUE)
public void handleDispatchCompleted(UtilRecords.DispatchEndedDTO event)
```

---

#### 🛡️ `handleDispatchValidated(...)`

**Triggered by:** `validated.dispatch.fanOut.provider.dispatch.service.queue.logs.service`
**Responsibility:**

* Notify the user that their dispatch has been validated.
* Start tracking the dispatch in the tracking service.

```java
@RabbitListener(queues = DISPATCH_VALIDATED_FANOUT_LOGS_QUEUE)
public void handleDispatchValidated(UtilRecords.ValidatedDispatch event)
```

---

#### 📍 `handleTrackingDispatchNotif(...)`

**Triggered by:** `start.tracking.fanOut.provider.logs.queue.logs`
**Responsibility:**

* Notify user that vehicle tracking has started.

```java
@RabbitListener(queues = DISPATCH_TRACKING_LOGS_QUEUE)
public void handleTrackingDispatchNotif(UtilRecords.StartTrackingDTO trackingEvent)
```

---

### 📓 Additional Notes

* All listeners are `@Transactional` to ensure rollback on failure.
* Each listener includes proper `null` checks and logs errors clearly using SLF4J.
* Errors during event handling **do not requeue** (they are logged and swallowed).

---
