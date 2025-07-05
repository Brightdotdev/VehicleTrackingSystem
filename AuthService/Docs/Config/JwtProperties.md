

# 🛡️ JwtProperties — Configuration for JWT Management

This class binds JWT-specific settings from the `application.yml` or environment variables into a Spring bean.

It's used by `JwtConfig` to access the **secret** and **expiration time** for tokens.

---

## 📦 Package

```

com.example.AuthService.Config.JwtProperties

````

---

## 📄 Source Mapping

The class is annotated with:

```java
@Component
@ConfigurationProperties(prefix = "auth.jwt")
````

That means it maps these properties from your `application.yml`:

```yaml
auth:
  jwt:
    secret: your-jwt-secret-string
    expiration: 604800000  # token lifespan in milliseconds (7 days here)
```

---

## 🔑 Fields

### `String secret`

* The cryptographic key used to **sign** and **verify** JWTs.
* Should be a **base64-encoded string** with a strong entropy (e.g. 256-bit for HMAC-SHA256).

### `long expiration`

* Milliseconds until the JWT token expires.
* Common values:

    * `600000` → 10 minutes
    * `3600000` → 1 hour
    * `604800000` → 7 days

---

## 🧪 Getters & Setters

```java
public String getSecret()
public void setSecret(String secret)

public long getExpiration()
public void setExpiration(long expiration)
```

Standard POJO accessors. No additional logic — these are just holders.

---

## 🧬 Used By

* ✅ [`JwtConfig`](./JwtConfig.md)

    * Injects `JwtProperties` to read config dynamically at runtime.
* ✅ `application.yml` or `.env`

    * Values provided externally so secrets aren't hardcoded.

---

## 🔐 Security Considerations

* **NEVER** commit secrets into version control.
* Use `.env` or secure vault integrations for prod secrets.
* Rotate your JWT secrets periodically and support dual keys if needed.

---

## 📁 Example `application.yml`

```yaml
auth:
  jwt:
    secret: ${JWT_SECRET}
    expiration: ${JWT_EXP}
```

Then define these in your `.env`:

```env
JWT_SECRET=your-super-long-secret-key
JWT_EXP=604800000
```

---

## 🔄 Alternative: `@Value`?

You could have used `@Value`:

```java
@Value("${auth.jwt.secret}")
private String secret;
```

But `@ConfigurationProperties` is better for grouping multiple related configs in a scalable, testable, and clean way.

---

## ✅ Summary

| Field      | Type     | Purpose                  |
| ---------- | -------- | ------------------------ |
| secret     | `String` | Signing/validating JWTs  |
| expiration | `long`   | Token lifespan in millis |

This config powers your JWT-based authentication lifecycle.

```

---

