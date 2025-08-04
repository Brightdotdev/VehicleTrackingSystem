
# 🧾 `JwtProperties` - JWT Configuration Properties

Located in: `com.example.DispatchService.Config`

The `JwtProperties` class is a **Spring Boot Configuration Properties** holder used for mapping JWT-related values from `application.yml` or `application.properties`.

It works in conjunction with the [`JwtConfig`](JwtConfig.md) class to handle token creation and validation.

---

## 🔧 Configuration Mapping

```yaml
# application.yml
auth:
  jwt:
    secret: my-super-secret-key-1234567890
    expiration: 86400000  # 24 hours in milliseconds
```

---

## 🧠 Purpose

* Centralizes JWT configuration to avoid hardcoding.
* Uses Spring’s `@ConfigurationProperties` for clean and type-safe binding.
* Enables changes without recompiling the code — just update the YAML/properties file.

---

## 🧱 Fields

| Field        | Type     | Description                                                                                      |
| ------------ | -------- | ------------------------------------------------------------------------------------------------ |
| `secret`     | `String` | Secret key used to sign and validate JWT tokens. Must be sufficiently long for HMAC-SHA signing. |
| `expiration` | `long`   | Token validity duration (in **milliseconds**). E.g., `86400000` = 24 hours.                      |

---

## 🔍 Methods

| Method                | Returns  | Description                                             |
| --------------------- | -------- | ------------------------------------------------------- |
| `getSecret()`         | `String` | Returns the configured JWT secret.                      |
| `setSecret(String)`   | `void`   | Sets the secret key from config.                        |
| `getExpiration()`     | `long`   | Returns the configured expiration time in milliseconds. |
| `setExpiration(long)` | `void`   | Sets the expiration time from config.                   |

---

## 🧪 Example Usage in Code

Used by the `JwtConfig` class:

```java
@Component
@ConfigurationProperties(prefix = "auth.jwt")
public class JwtProperties {
    private String secret;
    private long expiration;
    // getters and setters...
}
```

Spring automatically binds values:

```yaml
auth:
  jwt:
    secret: ${JWT_SECRET}
    expiration: 86400000
```

---

## 📌 Summary

* 🛡 **`secret`**: Protect this value. Never commit it to source control.
* ⏱ **`expiration`**: Determines token lifespan (typically 15 min, 1 hr, 24 hrs, etc).
* 🧩 Injected into `JwtConfig` for signing and validation logic.


