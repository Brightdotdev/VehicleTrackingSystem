# 🐰 `RabbitMqReceiverService.java` — Event Consumers for VehicleService

This service acts as the **RabbitMQ message listener** for the `VehicleService`. It listens to multiple queues for different **dispatch lifecycle events** (created, validated, completed, tracked, updated) and triggers the appropriate service logic.

Each method corresponds to a queue and is decorated with `@RabbitListener`.

---

## 📩 Message Consumer Functions

### 🆕 1. `handleDispatchToVehicle`

**Queue:** `vehicle.service.created.dispatch.queue`
**Event DTO:** `dispatchRequestBodyDTO`
**Purpose:**

* Marks a vehicle’s status as `PENDING` when a new dispatch is created.
* Initializes dispatch history.
* Calls `vehicleHealthService` to return dispatch eligibility and safety score.

```java
@RabbitListener(queues = QUEUE_DISPATCH_CREATED)
public Map<String, Object> handleDispatchToVehicle(dispatchRequestBodyDTO event)
```

---

### ✅ 2. `handleDispatchValidated`

**Queue:** `validated.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service`
**Event DTO:** `ValidatedDispatch`
**Purpose:**

* Accepts validated dispatch events.
* Updates vehicle’s dispatch history and status to `IN_PROGRESS`.

```java
@RabbitListener(queues = DISPATCH_VALIDATED_FANOUT_VEHICLE_QUEUE)
public void handleDispatchValidated(ValidatedDispatch event)
```

---

### ✅ 3. `handleDispatchCompletedFromDispatch`

**Queue:** `completed.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service`
**Event DTO:** `DispatchEndedDTO`
**Purpose:**

* Updates the vehicle dispatch status to `AVAILABLE` if it was `IN_PROGRESS`.

```java
@RabbitListener(queues = QUEUE_DISPATCH_COMPLETED)
public void handleDispatchCompletedFromDispatch(DispatchEndedDTO event)
```

---

### 🧾 4. `handleDispatchCompletedFromLogs`

**Queue:** `completed.dispatch.fanOut.provider.logs.queue.service.vehicle`
**Event DTO:** `DispatchEndedDTO`
**Purpose:**

* Same as above, but handles event from **LogsService** instead of **DispatchService**.

```java
@RabbitListener(queues = QUEUE_DISPATCH_FROM_LOGS)
public void handleDispatchCompletedFromLogs(DispatchEndedDTO event)
```

---

### 🛰️ 5. `handleDispatchTracking`

**Queue:** `start.tracking.fanOut.provider.logs.queue.vehicle`
**Event DTO:** `StartTrackingDTO`
**Purpose:**

* Tracks ongoing dispatch activity.
* Updates vehicle status and adds to dispatch history (if not already present).

```java
@RabbitListener(queues = QUEUE_DISPATCH_TRACKING)
public void handleDispatchTracking(StartTrackingDTO event)
```

---

### 📍 6. `handleVehicleLocationUpdate`

**Queue:** `tracking.checkPoint.fanOut.provider.logs.queue.vehicle.service`
**Event DTO:** `vehicleLocationUpdate`
**Purpose:**

* Updates the current geographic location of the vehicle.

```java
@RabbitListener(queues = QUEUE_VEHICLE_LOCATION)
public void handleVehicleLocationUpdate(vehicleLocationUpdate event)
```

---

## 🧠 Logging + Error Handling

* Each method logs success or failure using `SLF4J` logger.
* Gracefully returns `null` or exits if the event is invalid or incomplete.
* Exceptions are caught, logged, and not propagated to RabbitMQ (avoiding infinite retries).

---

## 📘 Summary Table

| Queue                                                         | Handler Method                        | Triggered By       | Action                 |
| ------------------------------------------------------------- | ------------------------------------- | ------------------ | ---------------------- |
| `vehicle.service.created.dispatch.queue`                      | `handleDispatchToVehicle`             | Dispatch creation  | Evaluate safety score  |
| `validated.dispatch...vehicle.service`                        | `handleDispatchValidated`             | Dispatch validated | Mark as in-progress    |
| `completed.dispatch...dispatch.service.queue.vehicle.service` | `handleDispatchCompletedFromDispatch` | Dispatch service   | Mark dispatch complete |
| `completed.dispatch...logs.queue.service.vehicle`             | `handleDispatchCompletedFromLogs`     | Logs service       | Mark dispatch complete |
| `start.tracking...queue.vehicle`                              | `handleDispatchTracking`              | Logs service       | Begin tracking         |
| `tracking.checkPoint...queue.vehicle.service`                 | `handleVehicleLocationUpdate`         | Logs service       | Update location        |

---
