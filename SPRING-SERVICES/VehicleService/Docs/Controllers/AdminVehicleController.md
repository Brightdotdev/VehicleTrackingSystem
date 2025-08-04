# 🚗 `AdminVehicleController.java` — Admin Vehicle Management API

This controller provides **admin-only** endpoints for managing vehicles in the system. It includes vehicle creation, lookup, marking for maintenance, and viewing dispatch history.

> ⚠️ All endpoints are secured with `@PreAuthorize("hasRole('ROLE_ADMIN')")`
> 🔐 Base URL prefix: `/v1/admin/vehicle`

---

## 🔄 Endpoints

---

### 1. **Get All Vehicles**

* **URL:** `GET /v1/admin/vehicle`
* **Description:** Fetch all vehicles in the system
* **Access:** Admin
* **Returns:** A list of `VehicleApiData` DTOs

```java
@GetMapping
public ResponseEntity<ApiResponse<List<VehicleApiData>>> getAllVehicles()
```

---

### 2. **Get Vehicle by VIN**

* **URL:** `GET /v1/admin/vehicle/{vin}`
* **Description:** Fetch vehicle by its unique VIN
* **Path Param:** `vin` – Vehicle Identification Number
* **Returns:** A full `VehicleModel` object

```java
@GetMapping("/{vin}")
public ResponseEntity<ApiResponse<VehicleModel>> getVehicleByVIN(@PathVariable String vin)
```

---

### 3. **Create a New (Healthy) Vehicle**

* **URL:** `POST /v1/admin/vehicle/new`
* **Description:** Adds a new, fully functional vehicle to the system
* **Body:** JSON of `VehicleDTO`
* **Returns:** Created `VehicleModel` with status `201`

```java
@PostMapping("/new")
public ResponseEntity<ApiResponse<VehicleModel>> saveVehicle(@RequestBody VehicleDTO vehicle)
```

---

### 4. **Create a New (Unhealthy) Vehicle**

* **URL:** `POST /v1/admin/vehicle/new/bad`
* **Description:** Adds a vehicle with randomized poor health for testing
* **Body:** JSON of `VehicleDTO`
* **Returns:** Created `VehicleModel` with lower safety scores

```java
@PostMapping("/new/bad")
public ResponseEntity<ApiResponse<VehicleModel>> saveBadVehicle(@RequestBody VehicleDTO vehicle)
```

---

### 5. **Mark Vehicle for Maintenance**

* **URL:** `POST /v1/admin/vehicle/mark-for-maintenance`
* **Description:** Marks the vehicle as “IN\_MAINTENANCE” using a wildcard attribute
* **Query Param:** `vin` – Vehicle Identification Number
* **Returns:** Updated `VehicleModel` object

```java
@PostMapping("/mark-for-maintenance")
public ResponseEntity<ApiResponse<VehicleModel>> setVehicleInMaintenance(@RequestParam String vin)
```

---

### 6. **Get Vehicle Dispatch History**

* **URL:** `GET /v1/admin/vehicle/get-dispatch-history`
* **Description:** Returns list of dispatch IDs associated with the vehicle
* **Query Param:** `vin` – Vehicle Identification Number
* **Returns:** `List<Long>` of dispatch history

```java
@GetMapping("/get-dispatch-history")
public ResponseEntity<ApiResponse<List<Long>>> getVehicleHistory(@RequestParam String vin)
```

---

## 🧠 Controller Logic Summary

* Uses `VehicleService` for all business logic.
* Wraps responses with custom `ApiResponse<T>` utility for standardized API output.
* Separates good and bad vehicle creation for easier testing and use case simulation.
* Leverages DTOs (`VehicleDTO`, `VehicleApiData`) for communication clarity and flexibility.

---

## 📘 Quick Route Table

| Endpoint                                 | Method | Purpose                  | Input             | Output                   |
| ---------------------------------------- | ------ | ------------------------ | ----------------- | ------------------------ |
| `/v1/admin/vehicle`                      | `GET`  | List all vehicles        | —                 | List of `VehicleApiData` |
| `/v1/admin/vehicle/{vin}`                | `GET`  | Get vehicle by VIN       | VIN path param    | `VehicleModel`           |
| `/v1/admin/vehicle/new`                  | `POST` | Create healthy vehicle   | `VehicleDTO` body | `VehicleModel`           |
| `/v1/admin/vehicle/new/bad`              | `POST` | Create unhealthy vehicle | `VehicleDTO` body | `VehicleModel`           |
| `/v1/admin/vehicle/mark-for-maintenance` | `POST` | Mark as in maintenance   | `vin` query param | Updated `VehicleModel`   |
| `/v1/admin/vehicle/get-dispatch-history` | `GET`  | Get dispatch IDs         | `vin` query param | List of `Long`           |

