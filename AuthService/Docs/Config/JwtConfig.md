

# 🔐 JwtConfig — JWT Management Utility

This configuration component centralizes all JWT-related logic for:

- Creating JWTs for users/admins
- Extracting data from tokens
- Validating tokens
- Handling token secrets and expiration

---

## 📦 Package

```

com.example.AuthService.Config.JwtConfig

````

---

## 🧠 Dependency

```java
private final JwtProperties jwtProperties;
````

* Injected from application YAML (`auth.jwt.secret`, `auth.jwt.expiration`)
* Used to sign/verify JWTs

---

## 🧾 Public Methods

### 🔑 `String generateToken(Authentication auth, String userImage, String name)`

* Converts `Authentication` to a JWT with custom claims:

    * `sub` = user's email
    * `roles` = list of authorities (like `ROLE_USER`, `ROLE_ADMIN`)
    * `userImage` = profile picture (optional)
    * `name` = display name

```java
return Jwts.builder()
    .subject(username)
    .claim("roles", roles)
    .claim("userImage", userImage)
    .claim("name", name)
    .expiration(new Date(System.currentTimeMillis() + getExpiration()))
    .signWith(getSecretKey())
    .compact();
```

---

### ✅ `boolean validateToken(String token)`

* Parses token
* Checks if the expiration is still valid

---

### 🎯 `String extractToken(HttpServletRequest request)`

* Reads JWT from the `Authorization: Bearer ...` header
* Returns `null` if missing or malformed

---

### 🧍 `String extractUsername(String token)`

* Retrieves `sub` (subject/email) from token claims

---

### ❌ `boolean isTokenExpired(String token)`

* Returns `true` if current date is after the token expiration

---

### 📦 `Claims getClaims(String token)`

* Parses and verifies JWT
* Returns the full payload of claims

---

### 🧪 `boolean validateTokenWithUserDetails(String token, UserDetails userDetails)`

* Validates the username in the token matches the current authenticated user
* Also checks if the token is expired

---

### 🔐 `SecretKey getSecretKey()`

* Creates a `javax.crypto.SecretKey` using the provided base64 JWT secret from the environment

---

### ⏰ `long getExpiration()`

* Returns how long the JWT should last (in milliseconds)

---

### 🫘 `@Bean public SecretKey jwtSecretKey()`

* Exposes the JWT signing key as a Spring-managed bean

Useful for injecting into filters or utilities.

---

## 🛠 Example Usage

### ✅ Token Generation in Controller

```java
String jwt = jwtConfig.generateToken(authentication, userImage, name);
```

### 🧪 Token Validation in Middleware

```java
if (!jwtConfig.validateToken(token)) {
    throw new UnauthorizedException("Invalid or expired token");
}
```

### 🧼 Token Extraction from Request

```java
String token = jwtConfig.extractToken(request);
```

---

## 🔒 Security Notes

* JWT secret must be kept secure.
* Expiration should be short for access tokens (e.g. 5m–15m) or long for persistent cookies (7d+).
* Avoid putting sensitive PII into JWTs (e.g. passwords, DOB, etc.)

---

## 📂 Related Classes

* `JwtProperties` — loaded from `application.yml`
* Used by: `AdminController`, `UserAuthController`, filters, and handlers

---

