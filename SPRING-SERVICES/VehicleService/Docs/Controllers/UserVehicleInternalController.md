# 🔐 `UserVehicleInternalController.java` — Internal Dispatch Handler

This controller is designed for **internal services** (not public users) to trigger dispatch checks and retrieve dispatch eligibility for a given vehicle. It is typically used by background systems or services like the **Dispatch Service**.

> 📍 **Base URL:** `/internal/user/vehicle`

---

## 🔄 Endpoints

---

### 🚀 1. **Initiate Dispatch Request (Internal Only)**

* **URL:** `POST /internal/user/vehicle/handle-new-dispatch`
* **Description:**
  Triggers dispatch readiness evaluation for a given vehicle.
  The system calculates health scores, checks wildcards (e.g., `IN_MAINTENANCE`), and validates if the dispatch is allowed.
* **Request Body:** `dispatchRequestBodyDTO`
  This DTO should contain:

    * `vehicleIdentificationNumber` (String)
    * `vehicleStatus` (Enum)
    * other metadata for dispatch
* **Response:** `Map<String, Object>`
  Includes:

    * `canDispatch`: boolean
    * `safetyScore`: double
    * `wildCards`: list of wildcard flags that are true
    * `healthAttributes`: score breakdown
    * `logicErrors`: any business rule violations (e.g., classified vehicle mismatch)

```java
@PostMapping("/handle-new-dispatch")
public ResponseEntity<ApiResponse<Map<String, Object>>> handleCreateDispatch(@RequestBody dispatchRequestBodyDTO dispatchEvent)
```

---

## ✅ Response Sample

```json
{
  "status": "success",
  "code": 201,
  "message": "Vehicles retrieved",
  "data": {
    "canDispatch": false,
    "safetyScore": 82.5,
    "wildCards": [
      {"IN_MAINTENANCE": true}
    ],
    "healthAttributes": [
      {"ENGINE": 25.0},
      {"BRAKES": 20.0},
      {"TIRES": 15.0}
    ],
    "logicErrors": {
      "invalidRequest": "Classified requests are only for classified vehicles"
    }
  }
}
```

---

## 📘 Purpose

| Feature                    | Role                             |
| -------------------------- | -------------------------------- |
| Dispatch Evaluation        | ✅ Internal Services              |
| Health & Wildcard Analysis | ✅                                |
| Vehicle Persistence        | ❌                                |
| Vehicle Visibility         | ❌ (no fetch or list routes here) |

---

## 📌 Route Summary

| Endpoint                                     | Method | Description                           | Input                    | Output                |
| -------------------------------------------- | ------ | ------------------------------------- | ------------------------ | --------------------- |
| `/internal/user/vehicle/handle-new-dispatch` | `POST` | Evaluate if vehicle can be dispatched | `dispatchRequestBodyDTO` | Dispatch analysis map |

---

## 🛡️ Notes

* This is **not exposed** to public users — only intended for internal service-to-service communication.
* It **reuses the same logic** as the user-facing controller but in an isolated environment for backend usage.
* Useful when dispatch requests come from **message queues**, internal orchestration, or non-HTTP events.

