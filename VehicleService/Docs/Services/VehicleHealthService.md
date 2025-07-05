# 🩺 VehicleHealthService – Safety & Dispatch Eligibility

The `VehicleHealthService` class is responsible for calculating the **dispatch eligibility**, **safety score**, and identifying disqualifying factors (e.g., wildcards or logical inconsistencies) for a given vehicle.

It is used by the `VehicleService` when a vehicle is being **staged for dispatch**.

---

## 📦 Method

### 🔍 `vehicleDispatchStatus(VehicleModel vehicle, dispatchRequestBodyDTO dispatchEvent)`

**Purpose**:
Evaluates a vehicle's health and wildcard status, along with business logic conditions, to determine if it is safe and allowed to be dispatched.

---

### 📥 Parameters

| Name            | Type                                 | Description                       |
| --------------- | ------------------------------------ | --------------------------------- |
| `vehicle`       | `VehicleModel`                       | The target vehicle entity         |
| `dispatchEvent` | `UtilRecords.dispatchRequestBodyDTO` | The incoming dispatch request DTO |

---

### 📤 Returns

Returns a `Map<String, Object>` with the following keys:

| Key                | Type                         | Description                                              |
| ------------------ | ---------------------------- | -------------------------------------------------------- |
| `safetyScore`      | `Double`                     | Sum of all health attribute scores                       |
| `vehicleImage`     | `List<String>`               | Images associated with the vehicle                       |
| `canDispatch`      | `Boolean`                    | Whether the vehicle passes all checks                    |
| `wildCards`        | `List<Map<String, Boolean>>` | True-valued wildcard attributes (issues)                 |
| `healthAttributes` | `List<Map<String, Double>>`  | Each health metric (e.g., `ENGINE: 30`)                  |
| `logicErrors`      | `Map<String, String>`        | Violations of business rules (e.g., classified mismatch) |

---

## ✅ Business Logic Breakdown

### 🚫 Dispatch Rejection Scenarios

| Condition                                                          | Reason                                                   |
| ------------------------------------------------------------------ | -------------------------------------------------------- |
| A **classified** dispatch is made for a **non-classified** vehicle | `"Classified requests are only for classified vehicles"` |
| A **classified** vehicle is requested for **transport**            | `"Classified Vehicles Cannot be used for Transport"`     |
| Any wildcard attribute is `true`                                   | Wildcards like `IN_MAINTENANCE`, `GPS_DISABLED`, etc.    |

---

## 🔧 Internal Score Computation

* Iterates over all `VehicleHealthAttributeModel` entries
* Sums each `score` into `safetyScore`
* Wildcards are scanned; if any value is `true`, dispatch is disallowed

---

## 🧪 Sample Return Payload

```json
{
  "safetyScore": 90.0,
  "vehicleImage": ["img1.jpg", "img2.jpg"],
  "canDispatch": false,
  "wildCards": [
    { "IN_MAINTENANCE": true }
  ],
  "healthAttributes": [
    { "ENGINE": 30.0 },
    { "BRAKES": 20.0 },
    { "TIRES": 15.0 },
    { "LIGHTS": 10.0 },
    { "BATTERY": 10.0 },
    { "TRANSMISSION": 5.0 }
  ],
  "logicErrors": {
    "invalidRequest": "Classified requests are only for classified vehicles"
  }
}
```

---

## 📘 Notes

* The `canDispatch` flag is the final decision point.
* Useful for generating a **pre-dispatch report** to visualize vehicle health.
* Designed to be consumed by frontend or orchestration systems before completing a dispatch.

---