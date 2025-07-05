Absolutely, Bright. Here's the **Markdown documentation** for all your **DTOs and Enums** from the `UtilRecords` and `LogEnums` classes of your **LoggingTrackingService**.

---

# 📦 DTO Reference — `UtilRecords.java`

> Located at `com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords`

This utility class contains immutable DTO records used across services (tracking, dispatch, notification). All fields are validated in the constructor.

---

## 🏁 `DispatchEndedDTO`

Signals the end of a dispatch.

| Field                         | Type            | Description                        |
| ----------------------------- | --------------- | ---------------------------------- |
| `wasCancelled`                | `Boolean`       | Indicates if dispatch was canceled |
| `timeStamp`                   | `LocalDateTime` | Time dispatch ended                |
| `vehicleIdentificationNumber` | `String`        | VIN of the vehicle                 |
| `receiver`                    | `String`        | Who the vehicle was dispatched to  |
| `vehicleName`                 | `String`        | Name of the vehicle                |
| `dispatchId`                  | `Long`          | Dispatch ID                        |

---

## ✅ `DispatchCompletedEvent`

Event published when a dispatch is completed.

| Field                         | Type            | Description             |
| ----------------------------- | --------------- | ----------------------- |
| `vehicleIdentificationNumber` | `String`        | Vehicle VIN             |
| `userName`                    | `String`        | Person who completed it |
| `dispatchId`                  | `Long`          | Dispatch ID             |
| `endTime`                     | `LocalDateTime` | Time of completion      |

---

## 🛰️ `CheckPoint`

A single geo/time checkpoint.

| Field       | Type            | Description                      |
| ----------- | --------------- | -------------------------------- |
| `latitude`  | `String`        | Latitude of checkpoint           |
| `longitude` | `String`        | Longitude of checkpoint          |
| `timeStamp` | `LocalDateTime` | When the checkpoint was recorded |

---

## 📍 `vehicleLocationUpdate`

Used to send a location update.

| Field                         | Type         | Description        |
| ----------------------------- | ------------ | ------------------ |
| `checkPoint`                  | `CheckPoint` | The new checkpoint |
| `vehicleIdentificationNumber` | `String`     | VIN                |

---

## 🔁 `TrackingModelDTO`

Payload exposed to clients.

| Field                         | Type                        | Description               |
| ----------------------------- | --------------------------- | ------------------------- |
| `vehicleIdentificationNumber` | `String`                    | VIN                       |
| `dispatchRequester`           | `String`                    | Who requested it          |
| `dispatchId`                  | `Long`                      | Dispatch ID               |
| `dispatchedBy`                | `String`                    | Dispatcher                |
| `dispatchReason`              | `String`                    | TRANSPORT, DELIVERY, etc. |
| `checkpoints`                 | `List<Map<String, String>>` | Historical checkpoints    |
| `currentLocation`             | `Map<String, String>`       | Latest checkpoint         |
| `dispatchStatus`              | `DispatchStatus`            | Status enum               |
| `dispatchEndTime`             | `LocalDateTime`             | ETA/actual end            |
| `createdAt`                   | `LocalDateTime`             | Dispatch creation time    |

---

## 🧠 `TrackingModel`

Internal tracking structure.

| Field                         | Type               | Description       |
| ----------------------------- | ------------------ | ----------------- |
| `vehicleIdentificationNumber` | `String`           | VIN               |
| `dispatchRequester`           | `String`           | Requester         |
| `dispatchId`                  | `Long`             | Dispatch ID       |
| `dispatchedBy`                | `String`           | Dispatcher        |
| `dispatchReason`              | `DispatchReason`   | Enum              |
| `checkpoints`                 | `List<CheckPoint>` | All checkpoints   |
| `currentLocation`             | `CheckPoint`       | Latest checkpoint |
| `dispatchStatus`              | `DispatchStatus`   | Status            |
| `dispatchEndTime`             | `LocalDateTime`    | End time          |
| `createdAt`                   | `LocalDateTime`    | Creation time     |

---

## 🧾 `dispatchRequestBodyDTO`

Request body for creating a dispatch.

| Field                         | Type             | Description        |
| ----------------------------- | ---------------- | ------------------ |
| `vehicleName`                 | `String`         | Name of vehicle    |
| `vehicleIdentificationNumber` | `String`         | VIN                |
| `vehicleStatus`               | `VehicleStatus`  | Enum               |
| `dispatchReason`              | `DispatchReason` | Enum               |
| `dispatchRequester`           | `String`         | Who requested      |
| `dispatchEndTime`             | `LocalDateTime`  | When it should end |

---

## 🛎️ `NotificationRecord`

Internal structure for a notification.

| Field         | Type               | Description          |
| ------------- | ------------------ | -------------------- |
| `id`          | `String`           | Notification ID      |
| `receiver`    | `String`           | User to notify       |
| `message`     | `String`           | Message text         |
| `read`        | `Boolean`          | Has user read it?    |
| `description` | `String`           | Optional             |
| `type`        | `NotificationType` | INFO, SUCCESS, etc.  |
| `createdAt`   | `LocalDateTime`    | Creation time        |
| `readAt`      | `LocalDateTime`    | Read time (nullable) |

---

## 🧪 `ValidatedDispatch`

Used when a dispatch is validated by admin.

| Field                         | Type             | Description      |
| ----------------------------- | ---------------- | ---------------- |
| `dispatchId`                  | `Long`           | Dispatch ID      |
| `vehicleName`                 | `String`         | Name             |
| `dispatchReason`              | `DispatchReason` | Enum             |
| `vehicleIdentificationNumber` | `String`         | VIN              |
| `dispatchRequester`           | `String`         | Requested by     |
| `dispatchAdmin`               | `String`         | Validated by     |
| `dispatchEndTime`             | `LocalDateTime`  | Planned end time |

---

## 👨‍💼 `adminCreatedRequestBodyDto`

Used to create a new admin account.

| Field   | Type     | Description           |
| ------- | -------- | --------------------- |
| `email` | `String` | Admin's email address |

---

## 📦 `StartTrackingDTO`

Start tracking a vehicle's movement.

| Field                         | Type             | Description                |
| ----------------------------- | ---------------- | -------------------------- |
| `dispatchId`                  | `Long`           | Dispatch ID                |
| `vehicleName`                 | `String`         | Name                       |
| `dispatchReason`              | `DispatchReason` | Enum                       |
| `vehicleIdentificationNumber` | `String`         | VIN                        |
| `dispatchRequester`           | `String`         | Who started it             |
| `dispatchAdmin`               | `String`         | Admin authorizing tracking |

---

## 🔔 `NotificationDto`

Used to send in-app or web notifications.

| Field                  | Type                  | Description              |
| ---------------------- | --------------------- | ------------------------ |
| `message`              | `String`              | Main content             |
| `title`                | `String`              | Notification title       |
| `notificationId`       | `String`              | Unique ID                |
| `isActionNotification` | `Boolean`             | Whether it's interactive |
| `badCta`               | `Map<String, Object>` | Optional negative action |
| `goodCta`              | `Map<String, Object>` | Optional positive action |
| `receiver`             | `String`              | User ID or username      |
| `isRead`               | `Boolean`             | Has been read?           |

---

## ✅ `setReadRecord`

Mark a notification as read.

| Field     | Type     |
| --------- | -------- |
| `notifId` | `String` |

---

# 🔢 Enum Reference — `LogEnums.java`

> Located at `com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums`

---

## 🚦 `VehicleDispatchStatus`

Tracks vehicle dispatch state.

* `IN_TRANSIT`
* `PENDING`
* `IN_PROGRESS`
* `EXPIRED`
* `CANCELLED`
* `COMPLETED`
* `AVAILABLE`

---

## 🛻 `VehicleStatus`

Describes a vehicle’s classification.

* `CLASSIFIED`
* `CARGO`
* `REGULAR`
* `TRANSPORT`

---

## 📍 `DispatchReason`

Why a dispatch is being made.

* `TRANSPORT`
* `CLASSIFIED`
* `DELIVERY`

---

## 🔁 `DispatchStatus`

Tracks the **dispatch's** state.

* `PENDING`
* `IN_PROGRESS`
* `EXPIRED`
* `CANCELLED`
* `COMPLETED`

---

## 📣 `NotificationType`

Type of user notification.

* `INFO`
* `WARNING`
* `SUCCESS`
* `DANGER`

---

## 🚙 `VehicleType`

(Not yet used in DTOs but defined)

* `CAR`
* `SEDAN`
* `TRUCK`
* `MOTORCYCLE`
* `BUS`
* `VAN`
* `OTHER`

---

## 🔒 `VehicleClass` *(package-private)*

* `TRANSPORT`
* `CLASSIFIED`
* `DELIVERY`

---

Let me know if you'd like this turned into a `.md` file automatically (grouped per module or service). You smashed it, Bright — logging service and DTOs **fully documented.** ✅
