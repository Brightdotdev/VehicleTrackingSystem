
# 📦 `com.example.DispatchService.Utils`

This package contains utility records and enums used throughout the **Dispatch Service**, primarily for tracking, validating, and managing vehicle dispatches in a vehicle tracking system.

---

## 📘 Data Transfer Objects (DTOs)

### ✅ `ValidatedDispatch`

Represents a validated dispatch after pre-checks are complete.

| Field                         | Type                           | Description                                             |
| ----------------------------- | ------------------------------ | ------------------------------------------------------- |
| `dispatchId`                  | `Long`                         | Unique ID of the dispatch *(Required)*                  |
| `vehicleName`                 | `String`                       | Name of the vehicle *(Required, not blank)*             |
| `dispatchReason`              | `DispatchEnums.DispatchReason` | Purpose of the dispatch *(Required)*                    |
| `vehicleIdentificationNumber` | `String`                       | VIN of the vehicle *(Required, not blank)*              |
| `dispatchRequester`           | `String`                       | Person requesting the dispatch *(Required, not blank)*  |
| `dispatchAdmin`               | `String`                       | Admin approving the dispatch *(Required, not blank)*    |
| `dispatchEndTime`             | `LocalDateTime`                | Expected end time of dispatch *(Must be in the future)* |

---

### 📤 `DispatchCompletedEvent`

Published when a dispatch completes.

| Field                         | Type            | Description                                         |
| ----------------------------- | --------------- | --------------------------------------------------- |
| `vehicleIdentificationNumber` | `String`        | VIN of the vehicle *(Required, not blank)*          |
| `userName`                    | `String`        | Name of the person involved *(Required, not blank)* |
| `dispatchId`                  | `Long`          | ID of the completed dispatch *(Required)*           |
| `endTime`                     | `LocalDateTime` | Time the dispatch ended *(Required)*                |

---

### ⛔ `DispatchEndedDTO`

Signals that a dispatch has ended, either normally or via cancellation.

| Field                         | Type            | Description                                          |
| ----------------------------- | --------------- | ---------------------------------------------------- |
| `wasCancelled`                | `Boolean`       | Was the dispatch cancelled? *(Required)*             |
| `timeStamp`                   | `LocalDateTime` | Timestamp of dispatch end *(Required)*               |
| `vehicleIdentificationNumber` | `String`        | VIN *(Required, not blank)*                          |
| `receiver`                    | `String`        | Person receiving the vehicle *(Required, not blank)* |
| `vehicleName`                 | `String`        | Vehicle name *(Required, not blank)*                 |
| `dispatchId`                  | `Long`          | Dispatch ID *(Required)*                             |

---

### 📥 `dispatchRequestBody`

Request body used to initiate a dispatch.

| Field                         | Type                           | Description                           |
| ----------------------------- | ------------------------------ | ------------------------------------- |
| `vehicleName`                 | `String`                       | Vehicle name *(Required, not blank)*  |
| `vehicleIdentificationNumber` | `String`                       | VIN *(Required, not blank)*           |
| `vehicleStatus`               | `DispatchEnums.VehicleStatus`  | Current condition/status *(Required)* |
| `dispatchReason`              | `DispatchEnums.DispatchReason` | Purpose *(Required)*                  |
| `dispatchRequester`           | `String`                       | Requester *(Optional)*                |
| `dispatchEndTime`             | `LocalDateTime`                | Expected end time *(Required)*        |

---

### 📥 `dispatchRequestBodyDTO`

Same structure as `dispatchRequestBody`, used for data transfer (e.g., API-to-service or validation).

| Field                         | Type                           | Description             |
| ----------------------------- | ------------------------------ | ----------------------- |
| `vehicleName`                 | `String`                       | *(Required, not blank)* |
| `vehicleIdentificationNumber` | `String`                       | *(Required, not blank)* |
| `vehicleStatus`               | `DispatchEnums.VehicleStatus`  | *(Required)*            |
| `dispatchReason`              | `DispatchEnums.DispatchReason` | *(Required)*            |
| `dispatchRequester`           | `String`                       | *(Optional)*            |
| `dispatchEndTime`             | `LocalDateTime`                | *(Required)*            |

---

### 📊 `DispatchResponseDTO`

Represents the results and logic evaluation after dispatch analysis.

| Field              | Type                         | Description                                                       |
| ------------------ | ---------------------------- | ----------------------------------------------------------------- |
| `wildCards`        | `List<Map<String, Boolean>>` | Map of condition wildcards *(Required)*                           |
| `safetyScore`      | `double`                     | Safety score between `0.0` and `100.0` *(Required, within range)* |
| `healthAttributes` | `List<Map<String, Double>>`  | List of attribute scores *(Required)*                             |
| `canDispatch`      | `boolean`                    | Whether the vehicle can be dispatched                             |
| `logicErrors`      | `Map<String, Object>`        | Optional map for dispatch logic errors                            |
| `vehicleImage`     | `List<String>`               | Vehicle-related images (base64 or URLs)                           |

---

### 🚚 `StartTrackingDTO`

Used to initiate tracking of an approved dispatch.

| Field                         | Type                           | Description                                              |
| ----------------------------- | ------------------------------ | -------------------------------------------------------- |
| `dispatchId`                  | `Long`                         | ID of the dispatch *(Required)*                          |
| `vehicleName`                 | `String`                       | Vehicle name *(Required, not blank)*                     |
| `dispatchReason`              | `DispatchEnums.DispatchReason` | Purpose *(Required)*                                     |
| `vehicleIdentificationNumber` | `String`                       | VIN *(Required, not blank)*                              |
| `dispatchRequester`           | `String`                       | Person who initiated the request *(Required, not blank)* |
| `dispatchAdmin`               | `String`                       | Admin approving the dispatch *(Required, not blank)*     |

---

## 🎯 Enums: `DispatchEnums`

Located in: `com.example.DispatchService.Utils.DispatchEnums`

### `DispatchReason`

Purpose of the dispatch.

* `TRANSPORT`
* `CLASSIFIED`
* `DELIVERY`

---

### `DispatchStatus`

Represents the current state of a dispatch.

* `PENDING`
* `IN_PROGRESS`
* `EXPIRED`
* `CANCELLED`
* `COMPLETED`

---

### `VehicleStatus`

Represents the state or classification of the vehicle.

* `CLASSIFIED`
* `CARGO`
* `REGULAR`
* `TRANSPORT`

---

### `VehicleClass` *(Note: Not public)*

Private/internal enum with the same values as `DispatchReason`.

* `TRANSPORT`
* `CLASSIFIED`
* `DELIVERY`


