

# 👤 `UserDispatchService` — User Dispatch Lifecycle Service

Located in: `com.example.DispatchService.Service`

This service handles **user-side dispatch actions**, such as creating, tracking, canceling, and rating a dispatch. It integrates with RabbitMQ for lifecycle events and ensures user-based security and validation.

---

## 🧰 Responsibilities

* Allow users to request a vehicle dispatch
* Prevent double bookings on vehicles
* Track the status of a user’s dispatch
* Cancel a user’s dispatch if needed
* Finalize and rate dispatches
* Synchronize with RabbitMQ for event publishing

---

## 🔗 Dependencies

| Dependency              | Purpose                                 |
| ----------------------- | --------------------------------------- |
| `DispatchRepository`    | Handles DB access for dispatch records  |
| `RabbitMqSenderService` | Publishes lifecycle events to queues    |
| `ResponseMapperService` | Maps responses from RabbitMQ            |
| `UtilRecords`           | Carries request/response data (records) |
| `DispatchEnums`         | Enum definitions like `Status`          |

---

## 🚦 Public Methods Overview

### 🚗 `requestVehicleDispatch(...)`

Creates a dispatch request for a user.
Steps:

* Checks if vehicle is already booked (by scanning all previous dispatches).
* Sends request to RabbitMQ and waits for decision (`canDispatch`).
* Maps RabbitMQ result to `DispatchModel`.
* Saves the result to DB and sends an event without response.

---

### 🛑 `userCancelingDispatch(...)`

Cancels a dispatch **initiated by the current user**.

Conditions:

* Must belong to the same requester
* Dispatch must still be valid (not expired or cancelled already)
* Sets `CANCELLED` status and updates metadata
* Publishes cancellation to RabbitMQ

---

### 🔁 `revalidateMyDispatches(user)`

Fetches all user dispatches, enriches them with metadata, and updates expired ones.

Logic:

* Checks and sets `EXPIRED` if endTime has passed
* Adds time-related metadata
* Publishes `DispatchEndedDTO` if expired
* Updates records in DB

---

### 🔁 `revalidateMyActiveDispatches(user)`

Similar to `revalidateMyDispatches`, but only returns **active** (valid) ones.
Ignores `CANCELLED`, `COMPLETED`, and `EXPIRED` in the return list.

---

### 🔍 `revalidateDispatchByIdUserAndVehicleId(...)`

Validates **a specific dispatch** by dispatchId, user, and vehicleId.

Adds:

* `"DispatchStatus"` metadata
* `expiresInMinutes` and `expiresInHours`
* Expires if needed

---

### 🔍 `getMyDispatchByVinAndId(...)`

Finds a dispatch for a user by:

* Dispatch ID
* Vehicle ID (VIN)
* Authenticated user

Throws `NotFoundException` if not found.

---

### ✅ `completeDispatch(...)`

Completes a dispatch manually.

* Checks if it belongs to the requester
* Marks as `COMPLETED`
* Updates metadata and `endTime`

---

### 🛰️ `handleDispatchTracking(...)`

Changes dispatch to `IN_PROGRESS` status when tracking starts.

* Ensures it exists and is valid
* Updates startTime and status

---

### 🌟 `setDispatchRating(...)`

Allows a user to rate a completed dispatch.

* Only valid for the original requester
* Updates `DispatchReviewScore`

---

## 🛠️ Internal Utility Methods

### 🧱 `getDispatchModel(...)`

Constructs and populates a `DispatchModel` from:

* RabbitMQ `DispatchResponseDTO`
* User info and dispatch form

Used by: `requestVehicleDispatch(...)`

---

### 🔍 `isStillValidDispatch(...)`

Checks if dispatch is still modifiable.
Throws if:

* `CANCELLED`
* `EXPIRED`

---

## ❗ Exception Flow

| Exception                 | Scenario                                           |
| ------------------------- | -------------------------------------------------- |
| `InvalidRequestException` | Role missing, unauthorized request, double booking |
| `NotFoundException`       | Dispatch not found or expired                      |
| `ConflictException`       | Attempt to start an invalid or duplicate dispatch  |

---

## 📤 RabbitMQ Events

| Event                                                 | Sent From                                        | Payload |
| ----------------------------------------------------- | ------------------------------------------------ | ------- |
| `sendDispatchCreatedEvent(...)`                       | Request dispatch                                 |         |
| `sendDispatchCreatedEventNoResponse(...)`             | Fire-and-forget for creation                     |         |
| `sendDispatchCompletedFanoutFromDispatchService(...)` | After user cancels or dispatch expires/completes |         |

---

## 🧠 Summary Table

| Method                                     | What it Does                                  |
| ------------------------------------------ | --------------------------------------------- |
| `requestVehicleDispatch()`                 | Request a vehicle dispatch                    |
| `userCancelingDispatch()`                  | Cancel your own dispatch                      |
| `revalidateMyDispatches()`                 | See all dispatches with updated metadata      |
| `revalidateMyActiveDispatches()`           | Show only currently active dispatches         |
| `revalidateDispatchByIdUserAndVehicleId()` | Validate a specific dispatch                  |
| `getMyDispatchByVinAndId()`                | Fetch a dispatch by ID and VIN                |
| `completeDispatch()`                       | Mark a dispatch as completed                  |
| `handleDispatchTracking()`                 | Start tracking a dispatch (sets IN\_PROGRESS) |
| `setDispatchRating()`                      | Submit a dispatch review/rating               |

---


