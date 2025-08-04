


# ⚙️ AuthProperties — Custom Configuration Class

`AuthProperties` is a Spring `@ConfigurationProperties` class used to **map and expose configuration values** related to JWT and internal API keys from the `application.yml` file.

---

## 📦 Package

```

com.example.AuthService.Config.AuthProperties

````

---

## 🧠 What It Does

This class pulls values from your config file under the prefix `auth`.  
It exposes two nested configs:

- 🔑 `auth.api.internalKey` → Used for internal service-to-service authentication
- 🔐 `auth.jwt` → Configures secret key, expiration, and issuer for JWT

---

## 🌱 Declaration

```java
@Component
@ConfigurationProperties(prefix = "auth")
public class AuthProperties
````

* `@Component` makes it available as a Spring bean.
* `@ConfigurationProperties(prefix = "auth")` tells Spring to bind YAML keys starting with `auth`.

---

## 🔑 `auth.api.internalKey`

```yaml
auth:
  api:
    key: your-internal-api-key
```

### Code Representation:

```java
public static class Api {
    private String internalKey;

    public String getInternalKey() { return internalKey; }
    public void setInternalKey(String internalKey) { this.internalKey = internalKey; }
}
```

This key is passed as a header (e.g. `X-Internal-API-Key`) in WebClient or security filters to allow trusted internal communication.

---

## 🔐 `auth.jwt` Config Section

```yaml
auth:
  jwt:
    secret: your-secret-key
    expiration: 604800000
    issuer: auth-service
```

### Code Representation:

```java
public static class Jwt {
    private String secret;
    private long expiration;
    private String issuer;

    // Getters and Setters...
}
```

| Field        | Purpose                                       |
| ------------ | --------------------------------------------- |
| `secret`     | The HMAC secret used to sign JWT tokens       |
| `expiration` | Duration in milliseconds before token expires |
| `issuer`     | JWT issuer name (e.g. `auth-service`)         |

---

## 📥 How to Access in Code

Anywhere in your app, you can inject `AuthProperties` like this:

```java
@Autowired
private AuthProperties authProperties;

String secret = authProperties.getJwt().getSecret();
String internalKey = authProperties.getApi().getInternalKey();
```

---

## 🧾 Sample `application.yml`

```yaml
auth:
  api:
    key: thisIsMyInternalKey
  jwt:
    secret: my-super-secret-hmac-key
    expiration: 604800000
    issuer: auth-service
```

---

## 🛠️ Used In

| Class              | Purpose                                            |
| ------------------ | -------------------------------------------------- |
| `JwtConfig`        | To build and validate JWTs                         |
| `WebClientConfig`  | To pass internal key in HTTP headers               |
| `JwtRequestFilter` | To verify if a request came from a trusted service |

---

## ✅ Summary

| Key                   | Description                                   |
| --------------------- | --------------------------------------------- |
| `auth.api.key`        | Internal secret for service-to-service calls  |
| `auth.jwt.secret`     | Signing key for JWT                           |
| `auth.jwt.expiration` | Token expiry duration in milliseconds         |
| `auth.jwt.issuer`     | Logical name of the JWT issuer (your service) |

This file ensures security values are externalized, easy to override, and reusable across components.

```
