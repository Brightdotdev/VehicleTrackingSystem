
# 🚗 `UserDispatchController`

📁 `com.example.DispatchService.Controller`

## ✅ Purpose

Exposes endpoints for **users (not admins)** to:

* Request a dispatch
* Cancel their own dispatch
* View all or specific dispatches
* Revalidate the status of their dispatches

All calls rely on `UserDispatchService` and contextual info from `UserHandler` (e.g., username, image, roles).

---

## 📦 Injected Dependencies

```java
@Autowired
public UserDispatchService userDispatchService;

@Autowired
public UserHandler userHandler;
```

---

## 🛣️ Base URL

```java
@RequestMapping("/v1/user/dispatch")
```

All endpoints begin with:

```
/v1/user/dispatch
```

---

## 📌 Endpoints Overview

### 1. 🚀 `POST /request-dispatch`

Request a new vehicle dispatch.

```java
@PostMapping("/request-dispatch")
```

* Grabs `userDeskToken` from cookies for WebClient auth
* Sends dispatch info and user metadata to service layer
* Returns the saved `DispatchModel` on success

📘 Input: `UtilRecords.dispatchRequestBody`
📤 Output: `DispatchModel`

📌 **Note**: Handles null dispatch with `403 Forbidden`.

---

### 2. 🔍 `GET /get-current-dispatch`

Fetch an existing dispatch by ID and vehicle VIN.

```java
@GetMapping("/get-current-dispatch")
```

* Uses query parameters: `dispatchId`, `vin`
* Verifies ownership in `UserDispatchService`
* Returns `DispatchModel` if found

---

### 3. ❌ `PUT /user-cancel`

User cancels their own dispatch.

```java
@PutMapping("/user-cancel")
```

* Requires `dispatchId` and `vin` as params
* Validates user identity via `userHandler`
* Marks dispatch as `CANCELLED`

📤 Returns: Cancelled `DispatchModel`

---

### 4. 🗃️ `GET /revalidate-all-me`

Revalidates all dispatches for the current user.

```java
@GetMapping("/revalidate-all-me")
```

* Updates expired/completed/cancelled statuses
* Adds metadata like `expiresInHours` and `expiresInMinutes`

📤 Returns: List of `DispatchModel`

---

### 5. 🟢 `GET /revalidate-active-dispatch`

Returns **only currently valid/active** dispatches.

```java
@GetMapping("/revalidate-active-dispatch")
```

* Filters out expired, cancelled, or completed
* Adds time-left metadata

---

### 6. 🔁 `GET /revalidate-dispatch-by-me-with-id`

Revalidates a single dispatch by ID and vehicle VIN.

```java
@GetMapping("/revalidate-dispatch-by-me-with-id")
```

* Triggers logic to update `EXPIRED` status if applicable
* Returns current status with metadata

---

## 🧠 Pseudocode Summary

```text
POST /request-dispatch
→ extract cookieValue from userDeskToken
→ call requestVehicleDispatch()
→ if success → return 201 + dispatch
→ else → return 403 Forbidden

GET /get-current-dispatch
→ get dispatch by dispatchId + vin for current user
→ if found → return 201
→ else → return 403 Forbidden

PUT /user-cancel
→ cancel dispatchId for current user
→ return updated model with status CANCELLED

GET /revalidate-all-me
→ get all user dispatches
→ update statuses (EXPIRED, COMPLETED, etc.)
→ return updated list

GET /revalidate-active-dispatch
→ filter and return only currently active dispatches

GET /revalidate-dispatch-by-me-with-id
→ revalidate single dispatch by ID and VIN
→ update status + metadata
→ return updated dispatch
```

---

## ✅ Suggestions for Improvement

| Area              | Suggestion                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| 🧼 Code Style     | Extract cookie parsing to a utility method for reuse/testability                                                    |
| 🔐 Security       | Ensure JWT token is not spoofed (consider verifying cookie structure or HMAC if self-rolled)                        |
| 🌐 API Docs       | Add Swagger `@Operation` for each method if using OpenAPI                                                           |
| 🧪 Testing        | Add integration tests to simulate request lifecycle (especially `/request-dispatch`)                                |
| ⚠️ Error Handling | In `request-dispatch`, handle potential NPE if `getCookies()` is null (some requests might not have cookies at all) |

