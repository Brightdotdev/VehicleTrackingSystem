# 🌐 WebClientConfig — Service-to-Service HTTP Client Setup

This configuration class defines `WebClient` beans for internal HTTP communication with **logging**, **vehicle**, and **dispatch** services using a shared internal API key.

---

## 📦 Package

```

com.example.AuthService.Config.WebClientConfig

````

---

## 🔧 Purpose

| Goal                                 | Explanation                                                               |
|--------------------------------------|---------------------------------------------------------------------------|
| Register `WebClient` instances       | Reusable clients for each external service                                |
| Set `baseUrl` dynamically            | Pulled from `application.yml` (`external.services.*.base-url`)            |
| Set internal auth header             | Adds `X-Internal-API-Key` to every request for secure service access       |

---

## 🌱 Dependencies

This class relies on:

- `AuthProperties` → pulls internal API key
- `application.yml` → provides each service's base URL

---

## 📁 Defined Beans

### 🧾 `WebClient loggingWebClient`

```java
@Bean
public WebClient loggingWebClient(@Value("${external.services.logging.base-url}") String baseUrl) {
    return WebClient.builder()
        .baseUrl(baseUrl)
        .defaultHeader("X-Internal-API-Key", authProperties.getApi().getInternalKey())
        .build();
}
````

### 🚗 `WebClient vehicleWebClient`

```java
@Bean
public WebClient vehicleWebClient(@Value("${external.services.vehicle.base-url}") String baseUrl) {
    return WebClient.builder()
        .baseUrl(baseUrl)
        .defaultHeader("X-Internal-API-Key", authProperties.getApi().getInternalKey())
        .build();
}
```

### 🛻 `WebClient dispatchWebClient`

```java
@Bean
public WebClient dispatchWebClient(@Value("${external.services.dispatch.base-url}") String baseUrl) {
    return WebClient.builder()
        .baseUrl(baseUrl)
        .defaultHeader("X-Internal-API-Key", authProperties.getApi().getInternalKey())
        .build();
}
```

---

## 🧾 Sample Configuration for development (`application.yml`)

```yaml
auth:
  api:
    key: your-internal-service-key

external:
  services:
    logging:
      base-url: http://localhost:8104
    vehicle:
      base-url: http://localhost:8106
    dispatch:
      base-url: http://localhost:8105
```

---

## 🔐 Internal API Security

All `WebClient` instances attach:

```
Header: X-Internal-API-Key: <your-key>
```

✅ This helps **authenticate service-to-service calls** in a distributed system — especially when bypassing user-level security like JWT.

---

## 🛠️ Example Usage in a Service

```java
@Autowired
@Qualifier("vehicleWebClient")
private WebClient vehicleWebClient;

public Mono<Object> sendData() {
    return vehicleWebClient.post()
        .uri("/internal/vehicle/status")
        .bodyValue(new MyPayload())
        .retrieve()
        .bodyToMono(Object.class);
}
```

---

## ✅ Summary

| Bean Name           | Target Service | Base URL Property                     | Security Header      |
| ------------------- | -------------- | ------------------------------------- | -------------------- |
| `loggingWebClient`  | Logging        | `external.services.logging.base-url`  | `X-Internal-API-Key` |
| `vehicleWebClient`  | Vehicle        | `external.services.vehicle.base-url`  | `X-Internal-API-Key` |
| `dispatchWebClient` | Dispatch       | `external.services.dispatch.base-url` | `X-Internal-API-Key` |

This config helps enforce internal access control and gives centralized, typed clients for service communication.

```
```
