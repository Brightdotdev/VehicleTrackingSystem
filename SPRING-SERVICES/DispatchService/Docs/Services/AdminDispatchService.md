
# 🧭 `AdminDispatchService` — Admin Dispatch Management Logic

Located in: `com.example.DispatchService.Service`

This service contains **core business logic for dispatch management** from an admin's perspective.

---

## 🔧 Responsibilities

* Validate and approve dispatches
* Cancel ongoing dispatches
* Revalidate dispatches (bulk and single)
* Enrich metadata (expiry, reason, etc.)
* Publish lifecycle events to RabbitMQ
* Track vehicle dispatch history

---

## 🧠 Dependencies

| Dependency              | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `DispatchRepository`    | Data access for all dispatch records                    |
| `RabbitMqSenderService` | Publish validated or completed events                   |
| `UtilRecords`           | Immutable data structures for internal and RabbitMQ use |
| `DispatchEnums`         | Enums for statuses, reasons, etc.                       |

---

## ✅ Methods Overview

### 🔐 `validateDispatch(adminEmail, userRole, dispatchId)`

Validates and approves a dispatch request.

* Ensures `ROLE_ADMIN` is present
* Checks if dispatch exists and is still valid
* Updates status to `IN_PROGRESS`
* Sets admin email
* Publishes event to RabbitMQ

### 🔕 `cancelDispatch(adminEmail, userRole, dispatchId, cancelReason)`

Cancels a dispatch with a given reason.

* Ensures `ROLE_ADMIN` is present
* Skips if expired/cancelled
* Updates metadata with cancel reason
* Sends cancel event to RabbitMQ
* Updates status to `CANCELLED`

---

## 🔁 Revalidation Functions

These are primarily **batch jobs or admin tools** to audit and update dispatch statuses.

### 🔁 `revalidateAllActiveDispatch()`

* Finds all dispatches
* Marks expired ones with `EXPIRED` status
* Adds human-readable metadata (`expiresInX`)
* Publishes expired event to RabbitMQ

### 🔁 `revalidateAllDispatch()`

Like the method above, but:

* Covers all dispatches (even expired)
* Tracks expiredSince metadata
* Preserves completed/cancelled as-is

### 🔁 `revalidateDispatchByIdAndVehicleId(dispatchId, vehicleId)`

Validates a single dispatch by ID and vehicle.

* If found and expired, sets metadata + `EXPIRED` status
* If active, adds `expiresInX` metadata
* Returns enriched dispatch record

---

## 📦 Utility Methods

### 📌 `getDispatchModel(...)`

Converts a `dispatchRequestBody` record into a `DispatchModel`.

Fields included:

* Vehicle ID, reason, end time, requester, etc.

### 🛡️ `isStillValidDispatch(dispatch)`

Throws an error if:

* Already assigned to another admin
* Already cancelled or expired

---

## 📜 Public Data Retrieval

### 📚 `getAllDispatch()`

Returns all dispatches (unfiltered).

---

### 🚗 `getVehicleHistory(vehicleId)`

Returns all dispatch records tied to a specific vehicle.

---

## ❗ Exception Handling

| Exception                 | Trigger                            |
| ------------------------- | ---------------------------------- |
| `InvalidRequestException` | Missing role or non-admin request  |
| `NotFoundException`       | Dispatch does not exist or expired |
| `ConflictException`       | Admin already assigned to dispatch |

---

## 🔔 Events Published

| Event                                        | DTO                 | Queue/Exchange                      |
| -------------------------------------------- | ------------------- | ----------------------------------- |
| `DispatchValidatedNoResponse`                | `ValidatedDispatch` | RabbitMQ Fanout or Direct (no wait) |
| `DispatchCompletedFanoutFromDispatchService` | `DispatchEndedDTO`  | RabbitMQ Fanout                     |

---

## 🧠 Summary

| Method                                 | Purpose                             |
| -------------------------------------- | ----------------------------------- |
| `validateDispatch()`                   | Approve and assign a dispatch       |
| `cancelDispatch()`                     | Cancel and explain dispatch failure |
| `revalidateAllDispatch()`              | Re-check status for all dispatches  |
| `revalidateAllActiveDispatch()`        | Check active ones only              |
| `revalidateDispatchByIdAndVehicleId()` | Re-check specific dispatch          |
| `getAllDispatch()`                     | Retrieve every dispatch in the DB   |
| `getVehicleHistory(vehicleId)`         | History of dispatches for a vehicle |

---

## 📎 Sample Use (Controller)

```java
@GetMapping("/v1/admin/revalidate")
public ResponseEntity<List<DispatchModel>> revalidate() {
    return ResponseEntity.ok(adminDispatchService.revalidateAllDispatch());
}
```

---

