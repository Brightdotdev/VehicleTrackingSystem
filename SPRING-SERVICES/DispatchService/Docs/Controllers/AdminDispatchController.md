


# 🚨 AdminDispatchController

📁 `com.example.DispatchService.Controller`

Handles all dispatch-related administrative operations, including validation, cancellation, auditing, and history retrieval.

---

## 🔐 Authorization

```java
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/v1/admin/dispatch")
```

* All endpoints are secured.
* Requires `ADMIN` role for access.

---

## 🧠 Responsibilities

| Endpoint                      | Method | Role    | Description                             |
| ----------------------------- | ------ | ------- | --------------------------------------- |
| `/validate`                   | PUT    | `ADMIN` | Approves a dispatch                     |
| `/admin-cancel`               | PUT    | `ADMIN` | Cancels a dispatch with reason          |
| `/get-all`                    | GET    | `ADMIN` | Fetches and revalidates all dispatches  |
| `/get-all/active`             | GET    | `ADMIN` | Fetches all active (not expired) ones   |
| `/get-dispatch-by-id-and-vin` | GET    | `ADMIN` | Revalidates single dispatch by ID + VIN |
| `/get-vehicle-history`        | GET    | `ADMIN` | Fetches all dispatches for a vehicle    |

---

## 📦 Dependencies Injected

```java
@Autowired AdminDispatchService adminDispatchService;
@Autowired UserDispatchService userDispatchService;
@Autowired UserHandler userHandler;
```

---

## 🔍 Method Breakdown with Comments

### ✅ Validate Dispatch

```java
@PutMapping("/validate")
public ResponseEntity<ApiResponse<DispatchModel>> validateDispatch(@RequestParam Long dispatchId)
```

* Uses `AdminDispatchService.validateDispatch(...)`
* Admin validates a dispatch using ID
* `userHandler` extracts current user + roles from Spring Security

---

### ❌ Admin Cancel Dispatch

```java
@PutMapping("/admin-cancel")
public ResponseEntity<ApiResponse<DispatchModel>> adminCancelDispatch(@RequestParam Long dispatchId, @RequestBody dispatchReason dispatchCancelReason)
```

* Cancels the dispatch with a custom reason (record class `dispatchReason`)
* Requires both user context and reason

---

### 🔁 Revalidate All Dispatches

```java
@GetMapping("/get-all")
public ResponseEntity<ApiResponse<List<DispatchModel>>> revalidateAllDispatch()
```

* Calls `adminDispatchService.revalidateAllDispatch()`
* Useful for maintenance scripts or audit commands

---

### ✅ Get All Active Dispatches

```java
@GetMapping("/get-all/active")
public ResponseEntity<ApiResponse<List<DispatchModel>>> revalidateAllActiveDispatches()
```

* Returns **only ongoing and valid** dispatches

---

### 🔍 Revalidate One Dispatch (by ID + VIN)

```java
@GetMapping("/get-dispatch-by-id-and-vin")
public ResponseEntity<ApiResponse<DispatchModel>> revalidateSingleDispatch(@RequestParam Long dispatchId, @RequestParam String vehicleId)
```

* Calls `adminDispatchService.revalidateDispatchByIdAndVehicleId(...)`

---

### 📜 Get Vehicle Dispatch History

```java
@GetMapping("/get-vehicle-history")
public ResponseEntity<ApiResponse<List<DispatchModel>>> getVehicleDispatchHistory(@RequestParam String vehicleVin)
```

* Returns full history of a vehicle’s dispatches
* Helps detect abnormal usage patterns, frequent cancels, etc.

---

### 🧪 Test Auth Endpoint (for debugging)

```java
@GetMapping
public ResponseEntity<?> getCurrentUser()
```

* Useful for frontend debugging JWT issues
* Returns `username` and `roles` extracted from Spring Security

---

## 📄 Pseudocode Summary

```text
IF Admin calls /validate with dispatchId:
    → Fetch user info from JWT
    → Validate dispatch using AdminService

IF Admin calls /admin-cancel with reason:
    → Check current user + roles
    → Call cancel method with reason
    → Return cancelled dispatch

IF Admin calls /get-all:
    → Call revalidation for all dispatches
    → Return result

IF Admin calls /get-all/active:
    → Fetch only dispatches that haven’t expired/cancelled

IF Admin calls /get-dispatch-by-id-and-vin:
    → Use ID and VIN to get dispatch metadata

IF Admin calls /get-vehicle-history:
    → Return historical list of all dispatches for a vehicle
```

---

## ✅ Response Format

Uses your shared `ApiResponse<T>` wrapper:

```json
{
  "status": "success",
  "code": 201,
  "message": "Dispatch cancel Success",
  "data": { /* DispatchModel or List<DispatchModel> */ }
}
```

---

## 💡 Suggested Improvements

| Area                | Suggestion                                                                  |
| ------------------- | --------------------------------------------------------------------------- |
| ✅ Validation        | Add `@Valid` for `dispatchId` to enforce non-null, positive                 |
| 🧼 Refactoring      | Move all route constants to a separate `Routes.java` file                   |
| 📜 Swagger Docs     | Annotate each method with `@Operation`, `@Parameter`, `@ApiResponses`       |
| 🔐 Role Granularity | Allow future `SUPER_ADMIN` for override scenarios                           |
| 🧪 Testing          | Add test endpoint for dispatch state verification or simulate admin actions |

---


