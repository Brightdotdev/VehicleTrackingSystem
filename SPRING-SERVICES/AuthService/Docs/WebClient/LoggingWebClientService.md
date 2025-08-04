# 🔗 LoggingWebClientService — Inter-service Communication

This service handles asynchronous HTTP POST requests to the **LoggingService** using Spring's reactive `WebClient`.

It sends internal admin-related events — specifically when a new admin is created in the AuthService — to the LoggingService’s internal endpoint.

---

## 📦 Package

```

com.example.AuthService.WebClient

````

---

## 🧩 Class: `LoggingWebClientService`

| Annotation | Purpose                                      |
|------------|----------------------------------------------|
| `@Service` | Registers the class as a Spring-managed bean |

This service is injected wherever internal communication with the LoggingService is needed.

---

## 📌 Dependencies

### 🔗 `WebClient loggingWebClient`

```java
public LoggingWebClientService(@Qualifier("loggingWebClient") WebClient loggingWebClient)
````

This client is configured in [`WebClientConfig`](../config/webclient-config.md) with:

* `base-url: ${external.services.logging.base-url}`
* default header: `X-Internal-API-Key` for authentication

---

## 🚀 Method: `sendAdminCreated(String email)`

### 🔧 Signature

```java
public Mono<ApiResponse<Map<String, Object>>> sendAdminCreated(String email)
```

### 📥 Input

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| `email`   | String | Admin email to register |

Creates a request body of type:

```java
new UtilRecords.adminCreatedRequestBodyDto(email);
```

---

### 📤 Request Details

| Field   | Value                            |
| ------- | -------------------------------- |
| Method  | `POST`                           |
| URI     | `/internal/admin/create`         |
| Headers | `Content-Type: application/json` |
| Body    | DTO containing admin email       |

---

### 📥 Expected Response

`ApiResponse<Map<String, Object>>`

Sample structure:

```json
{
  "status": 201,
  "message": "User saved successfully",
  "data": {
    "createdNew": true
  }
}
```

---

### ❗ Error Handling

On failure (e.g. server down, timeout), a fallback is returned:

```json
{
  "status": 500,
  "message": "Internal call failed",
  "data": {
    "createdNew": false,
    "error": "<exception message>"
  }
}
```

This avoids crashing the calling service and provides graceful degradation.

---

## 🧪 Example Usage

```java
loggingWebClientService.sendAdminCreated("admin@example.com")
    .subscribe(response -> {
        boolean created = (Boolean) response.getData().get("createdNew");
        System.out.println("Admin created? " + created);
    });
```

---

## 📁 Related Files

* [`WebClientConfig`](../Config/WebClientConfig.md)
* [`AuthProperties`](../Config/AuthProperties.md)
* [`UtilRecords`](../DTO.md)
---

## ✅ Summary

| Component           | Role                               |
| ------------------- | ---------------------------------- |
| `WebClient`         | Sends HTTP POST to LoggingService  |
| `@Qualifier`        | Injects the correct client bean    |
| `onErrorResume`     | Ensures fallback for reliability   |
| `Mono<ApiResponse>` | Handles non-blocking reactive flow |


