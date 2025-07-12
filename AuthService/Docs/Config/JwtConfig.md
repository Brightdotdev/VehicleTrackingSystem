# 🔐 JwtConfig — JWT Utility & Token Generator

This class is responsible for **creating**, **signing**, **validating**, and **parsing JWT tokens**.  
It uses a secret key defined in `application.yml` via `AuthProperties`.

---

## 📦 Package

```

com.example.AuthService.Config.JwtConfig

````

---

## 🔧 Purpose

| Feature                    | Description                                                             |
|----------------------------|-------------------------------------------------------------------------|
| Generate JWT               | Builds signed JWT using claims and Spring `Authentication` object       |
| Parse and validate tokens  | Ensures token is valid and not expired                                  |
| Expose SecretKey as Bean   | Makes HMAC signing key available as a Spring `@Bean`                    |

---

## 🌱 Dependencies

This class depends on:

- `AuthProperties` → for secret, issuer, and expiration
- `io.jsonwebtoken` (JJWT) → for creating/parsing JWTs

---

## 🔐 JWT Generation

### `String generateToken(Authentication auth, String userImage, String name)`

```java
Jwts.builder()
    .subject(username)
    .claim("roles", roles)
    .claim("userImage", userImage)
    .claim("name", name)
    .expiration(new Date(System.currentTimeMillis() + getExpiration()))
    .signWith(getSecretKey())
    .compact();
````

**Claims included in token:**

| Claim       | Type   | Description                     |
| ----------- | ------ | ------------------------------- |
| `sub`       | String | Username (i.e. user email)      |
| `roles`     | List   | Authorities from Spring context |
| `userImage` | String | User avatar or image path       |
| `name`      | String | User's name                     |
| `exp`       | Date   | Token expiration timestamp      |

---

## 🔑 Token Parsing Methods

### ✅ `boolean validateToken(String token)`

* Returns `true` if the token is valid and **not expired**.

### 🔍 `String extractUsername(String token)`

* Extracts the username from the token's subject (`sub` claim).

### 🧯 `boolean isTokenExpired(String token)`

* Returns `true` if the token has expired.

### 📜 `Claims getClaims(String token)`

* Parses the token and returns its payload claims as a `Claims` object.

---

## 🔐 Secret Key Handling

### 🔐 `SecretKey getSecretKey()`

```java
Keys.hmacShaKeyFor(authProperties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8));
```

* Converts secret from your config into a cryptographic key for HMAC signing.

### 🧱 Spring Bean

```java
@Bean
public SecretKey jwtSecretKey() {
    return getSecretKey();
}
```

* Registers the `SecretKey` as a bean, so it can be reused by other components (like filters or WebClient configs).

---

## 🧾 Sample Configuration

From `application.yml`:

```yaml
auth:
  jwt:
    secret: 6715c78c9a1d...
    expiration: 604800000
    issuer: auth-service
```

---

## 📁 Used In

| Class              | Purpose                               |
| ------------------ | ------------------------------------- |
| `JwtRequestFilter` | Verifies tokens on each HTTP request  |
| `LoginController`  | Generates token during login          |
| `WebClientConfig`  | Sets secret for secure internal calls |

---

## ✅ Summary

| Method              | Purpose                              |
| ------------------- | ------------------------------------ |
| `generateToken()`   | Creates JWT with claims + expiration |
| `validateToken()`   | Checks token validity + expiration   |
| `extractUsername()` | Extracts username from token         |
| `isTokenExpired()`  | Checks if token is expired           |
| `getClaims()`       | Parses and returns JWT claims        |
| `jwtSecretKey()`    | Exposes HMAC signing key as a bean   |

This class is essential for issuing and verifying access tokens securely within the system.

```