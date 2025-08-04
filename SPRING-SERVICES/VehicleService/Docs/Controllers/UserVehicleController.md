# 👤 `UserVehicleController.java` — User Vehicle Interaction API

This controller provides **user-level** access to fetch vehicle data and initiate dispatch requests. Unlike the admin controller, users cannot create or update vehicle records.

> 📍 **Base URL:** `/v1/user/vehicle`

---

## 🔄 Endpoints

---

### 1. **Fetch All Vehicles**

* **URL:** `GET /v1/user/vehicle`
* **Description:** Fetch all vehicles currently available in the system
* **Returns:** A list of `VehicleApiData` (readable DTOs for frontend/client use)

```java
@GetMapping
public ResponseEntity<ApiResponse<List<VehicleApiData>>> getAllVehicles()
```

---

### 2. **Get Vehicle by VIN**

* **URL:** `GET /v1/user/vehicle/get-by-vin?vin={VIN}`
* **Description:** Fetch a single vehicle's public details by VIN
* **Query Param:** `vin` — Vehicle Identification Number
* **Returns:** `VehicleApiData` object

```java
@GetMapping("/get-by-vin")
public ResponseEntity<ApiResponse<VehicleApiData>> getVehicleByVin(@RequestParam String vin)
```

---

### 3. **Initiate New Dispatch (Request Vehicle)**

* **URL:** `POST /v1/user/vehicle/handle-new-dispatch`
* **Description:** Starts the dispatch process for a vehicle
* **Body:** JSON object of `dispatchRequestBodyDTO` (includes VIN and dispatch metadata)
* **Returns:** Map of dispatch readiness info (e.g. `canDispatch`, `safetyScore`, `wildCards`, etc.)

```java
@PostMapping("/handle-new-dispatch")
public ResponseEntity<ApiResponse<Map<String, Object>>> handleCreateDispatch(@RequestBody dispatchRequestBodyDTO dispatchEvent)
```

---

## 🧠 Summary of Responsibilities

| Feature                        | Role                  |
| ------------------------------ | --------------------- |
| View Vehicles                  | ✅ Public (User-level) |
| View Vehicle by VIN            | ✅ User-level          |
| Request a Vehicle for Dispatch | ✅ User-level          |
| Create/Update Vehicle          | ❌ Not allowed         |
| Mark Maintenance               | ❌ Not allowed         |
| View Dispatch History          | ❌ Not allowed         |

---

## 📘 Quick Route Table

| Endpoint                               | Method | Description              | Input                    | Output                        |
| -------------------------------------- | ------ | ------------------------ | ------------------------ | ----------------------------- |
| `/v1/user/vehicle`                     | `GET`  | Fetch all vehicles       | —                        | List of `VehicleApiData`      |
| `/v1/user/vehicle/get-by-vin`          | `GET`  | Fetch by VIN             | `vin` query param        | `VehicleApiData`              |
| `/v1/user/vehicle/handle-new-dispatch` | `POST` | Request vehicle dispatch | `dispatchRequestBodyDTO` | Map with dispatch status info |

---

## 🛡️ Notes

* Vehicles are returned using a **DTO** (`VehicleApiData`) to hide sensitive fields.
* This controller assumes role-based security is handled globally (no annotations here).
* The dispatch logic checks health/wildcard status before approving the dispatch (`canDispatch: true/false`).

