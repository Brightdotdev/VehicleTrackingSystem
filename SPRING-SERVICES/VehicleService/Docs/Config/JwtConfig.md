

# 🔐 `JwtConfig` - JWT Configuration & Utility

Located in: `com.example.VehicleService.Config`

The `JwtConfig` class handles **JWT token validation, parsing, extraction**, and **key generation** using `jjwt` and Spring Boot configuration properties.

It uses a configuration-backed secret key and expiration time defined via `application.yml` or `application.properties`.

---

## 🛠️ Configuration Properties

To work properly, this class expects the following properties under the prefix `auth.jwt`:

```yaml
auth:
  jwt:
    secret: your-256-bit-secret
    expiration: 86400000  # 24 hours in milliseconds
```

---

## 🧠 Constructor

```java
public JwtConfig(JwtProperties authProperties)
```

* Injects a custom `JwtProperties` class containing JWT config values (`secret`, `expiration`).
* Enables use of Spring’s `@ConfigurationProperties`.

---

## 🔑 `SecretKey getSecretKey()`

Generates an HMAC SHA-based `SecretKey` using the provided secret.

* **Returns:** `SecretKey`
* **Uses:** UTF-8 encoded bytes of the secret.

---

## 🪪 `@Bean SecretKey jwtSecretKey()`

Exposes the secret key as a Spring bean, making it injectable elsewhere (e.g., JWT service).

---

## ⏱ `long getExpiration()`

Returns the expiration duration for a JWT in milliseconds.

* Useful for creating new tokens.

---

## ✅ `boolean validateToken(String token)`

Checks if a JWT is valid by:

* Parsing claims
* Ensuring the expiration time is after the current date

Returns `false` on any parsing error.

---

## 🧾 `String extractToken(HttpServletRequest request)`

Parses the `Authorization` header and returns the JWT.

* **Header Format Expected:** `Authorization: Bearer <token>`
* **Returns:** The raw token string or `null` if missing.

---

## 👤 `String extractUser(String token)`

Extracts the **subject** (username or user ID) from the JWT.

* Uses `Claims.getSubject()`

---

## 🕐 `boolean isTokenExpired(String token)`

Checks whether the token has already expired.

---

## 📜 `Claims getClaims(String token)`

Parses a signed JWT using the secret key and returns its **payload claims**.

* **Throws:** `JwtException` on failure (internally caught in validation).
* **Important:** This uses `Jwts.parser().verifyWith(key).build().parseSignedClaims(token)`

---

## 📌 Summary of Responsibilities

| Method             | Purpose                                            |
| ------------------ | -------------------------------------------------- |
| `getSecretKey()`   | Creates cryptographic key for signing/verification |
| `jwtSecretKey()`   | Exposes key as a Spring bean                       |
| `getExpiration()`  | Gets configured expiration time                    |
| `validateToken()`  | Checks if a JWT is valid and not expired           |
| `extractToken()`   | Retrieves token from HTTP header                   |
| `extractUser()`    | Extracts subject from JWT                          |
| `isTokenExpired()` | Checks if the token has expired                    |
| `getClaims()`      | Decodes JWT and returns payload claims             |

---

## 🧪 Sample Usage

```java
@Autowired
private JwtConfig jwtConfig;

public void authenticate(HttpServletRequest request) {
    String token = jwtConfig.extractToken(request);
    if (token != null && jwtConfig.validateToken(token)) {
        String user = jwtConfig.extractUser(token);
        // Proceed with authentication...
    }
}
```


