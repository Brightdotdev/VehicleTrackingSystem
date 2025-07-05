
# 🧾 Vehicle Service – DTO & Enum Reference

This document outlines all Data Transfer Objects (DTOs) and enumerations used in the `VehicleService` backend system. Each DTO is used for either **data input**, **internal processing**, or **API output** in the vehicle dispatch and tracking workflow.

---

## 📦 Package

```java
package com.example.VehicleService.Utils;
```

---

## 📚 Index

### DTOs

* [DispatchEndedDTO](#dispatchendeddto)
* [ValidatedDispatch](#validateddispatch)
* [VehicleDTO](#vehicledto)
* [VehicleApiData](#vehicleapidata)
* [dispatchRequestBodyDTO](#dispatchrequestbodydto)
* [vehicleLocationUpdate](#vehiclelocationupdate)
* [LocationCheckPoint](#locationcheckpoint)
* [StartTrackingDTO](#starttrackingdto)

### Enums

* [EngineType](#enginetype)
* [VehicleType](#vehicletype)
* [VehicleDispatchStatus](#vehicledispatchstatus)
* [VehicleStatus](#vehiclestatus)
* [DispatchReason](#dispatchreason)
* [VehicleHealthAttributeType](#vehiclehealthattributetype)
* [VehicleWildCardType](#vehiclewildcardtype)

---

## 📤 DTOs

### `DispatchEndedDTO`

Used to signal that a dispatch has ended.

| Field                         | Type          | Required | Description                        |
| ----------------------------- | ------------- | -------- | ---------------------------------- |
| `wasCancelled`                | Boolean       | ✅        | Whether the dispatch was cancelled |
| `timeStamp`                   | LocalDateTime | ✅        | End time of the dispatch           |
| `vehicleIdentificationNumber` | String        | ✅        | Vehicle's VIN                      |
| `receiver`                    | String        | ✅        | Person receiving the vehicle       |
| `vehicleName`                 | String        | ✅        | Name of the vehicle                |
| `dispatchId`                  | Long          | ✅        | Dispatch identifier                |

---

### `ValidatedDispatch`

Returned internally after a dispatch is successfully validated.

| Field                         | Type           | Required | Description                |
| ----------------------------- | -------------- | -------- | -------------------------- |
| `dispatchId`                  | Long           | ✅        | ID of the dispatch         |
| `vehicleName`                 | String         | ✅        | Vehicle name               |
| `dispatchReason`              | DispatchReason | ✅        | Reason for dispatch        |
| `vehicleIdentificationNumber` | String         | ✅        | VIN                        |
| `dispatchRequester`           | String         | ✅        | Who requested the dispatch |
| `dispatchAdmin`               | String         | ✅        | Admin approving/validating |
| `dispatchEndTime`             | LocalDateTime  | ✅        | Must be **in the future**  |

---

### `VehicleDTO`

Used to create or update a vehicle record.

| Field             | Type               | Required | Description          |
| ----------------- | ------------------ | -------- | -------------------- |
| `model`           | String             | ✅        | Vehicle model        |
| `engineType`      | EngineType         | ✅        | Engine configuration |
| `vehicleType`     | VehicleType        | ✅        | Type/category        |
| `vehicleStatus`   | VehicleStatus      | ✅        | Operational status   |
| `vehicleMetadata` | String             | ❌        | Any extra info       |
| `vehicleImages`   | List<String>       | ❌        | URLs of images       |
| `vehicleLocation` | LocationCheckPoint | ❌        | Initial location     |

---

### `VehicleApiData`

Returned from external APIs providing full vehicle info.

| Field                         | Type                                | Required | Description               |
| ----------------------------- | ----------------------------------- | -------- | ------------------------- |
| `vehicleIdentificationNumber` | String                              | ✅        | VIN                       |
| `licensePlate`                | String                              | ✅        | Plate number              |
| `model`                       | String                              | ✅        | Model name                |
| `engineType`                  | EngineType                          | ✅        | Engine config             |
| `vehicleType`                 | VehicleType                         | ✅        | Type                      |
| `vehicleStatus`               | VehicleStatus                       | ✅        | Status                    |
| `dispatchStatus`              | VehicleDispatchStatus               | ✅        | Current dispatch status   |
| `dispatchHistory`             | List<Long>                          | ✅        | Previous dispatch IDs     |
| `vehicleImages`               | List<String>                        | ✅        | Image URLs                |
| `safetyScore`                 | double                              | ✅        | Safety score (0–100)      |
| `vehicleMetadata`             | String                              | ❌        | Optional info             |
| `vehicleAcquiredYear`         | int                                 | ❌        | Year of acquisition       |
| `healthAttributes`            | List<VehicleHealthAttributeModel>   | ✅        | Score-based health checks |
| `wildCardAttributes`          | List<VehicleWildcardAttributeModel> | ❌        | Unpredictable status tags |
| `location`                    | LocationCheckPoint                  | ❌        | Last known location       |

---

### `dispatchRequestBodyDTO`

Input body for creating a dispatch.

| Field                         | Type           | Required | Description               |
| ----------------------------- | -------------- | -------- | ------------------------- |
| `vehicleName`                 | String         | ✅        | Name of vehicle           |
| `vehicleIdentificationNumber` | String         | ✅        | VIN                       |
| `vehicleStatus`               | VehicleStatus  | ✅        | Current status            |
| `dispatchReason`              | DispatchReason | ✅        | Why it's being dispatched |
| `dispatchRequester`           | String         | ❌        | Who requested it          |
| `dispatchEndTime`             | LocalDateTime  | ✅        | Expected end of dispatch  |

---

### `vehicleLocationUpdate`

Used to update a vehicle's real-time location.

| Field                         | Type               | Required | Description        |
| ----------------------------- | ------------------ | -------- | ------------------ |
| `checkPoint`                  | LocationCheckPoint | ✅        | Current geo + time |
| `vehicleIdentificationNumber` | String             | ✅        | VIN                |

---

### `LocationCheckPoint`

Embeddable object for tracking a single location and timestamp.

| Field       | Type          | Required | Description          |
| ----------- | ------------- | -------- | -------------------- |
| `latitude`  | Double        | ✅        | Latitude             |
| `longitude` | Double        | ✅        | Longitude            |
| `timeStamp` | LocalDateTime | ❌        | When it was recorded |

---

### `StartTrackingDTO`

Used to start tracking a new dispatch journey.

| Field                         | Type           | Required | Description    |
| ----------------------------- | -------------- | -------- | -------------- |
| `dispatchId`                  | Long           | ✅        | ID of dispatch |
| `vehicleName`                 | String         | ✅        | Vehicle name   |
| `dispatchReason`              | DispatchReason | ✅        | Reason         |
| `vehicleIdentificationNumber` | String         | ✅        | VIN            |
| `dispatchRequester`           | String         | ✅        | Requester      |
| `dispatchAdmin`               | String         | ✅        | Dispatcher     |

---

## 📘 Enums

### `EngineType`

```java
GAS, DIESEL, ELECTRIC, HYBRID
```

Defines the engine configuration.

---

### `VehicleType`

```java
CAR, SEDAN, TRUCK, MOTORCYCLE, BUS, VAN, OTHER
```

Defines vehicle categories.

---

### `VehicleDispatchStatus`

```java
IN_TRANSIT, PENDING, IN_PROGRESS, AVAILABLE
```

Tracks current dispatch status.

---

### `VehicleStatus`

```java
CLASSIFIED, CARGO, REGULAR, TRANSPORT
```

Defines operational purpose or classification.

---

### `DispatchReason`

```java
TRANSPORT, CLASSIFIED, DELIVERY
```

Indicates why the vehicle is being dispatched.

---

### `VehicleHealthAttributeType`

| Attribute    | Score |
| ------------ | ----- |
| ENGINE       | 30    |
| BRAKES       | 20    |
| TIRES        | 15    |
| LIGHTS       | 10    |
| BATTERY      | 10    |
| TRANSMISSION | 15    |

These scores contribute to a **vehicle's safety score**.

---

### `VehicleWildCardType`

```java
ENGINE_LOCKED,
GPS_DISABLED,
UNVERIFIED_VIN,
FLAGGED_FOR_INSPECTION,
INSURANCE_IS_EXPIRED,
IN_MAINTENANCE
```

Unexpected or critical status flags that need attention.

---

