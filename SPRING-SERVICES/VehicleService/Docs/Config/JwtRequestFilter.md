

# 🧰 `JwtRequestFilter.java` – JWT Authentication Filter

This class defines a **custom JWT filter** for intercepting incoming HTTP requests and authenticating users using JWTs found in headers or cookies.

It is a Spring `OncePerRequestFilter`, ensuring it runs **once per request**, and integrates with Spring Security's context to authorize users based on token roles.

---

## 📦 Package Declaration

```java
package com.example.VehicleService.Config;
```

---

## 📚 Imports

Key libraries include:

* `io.jsonwebtoken.*` for parsing and validating JWT tokens.
* `org.springframework.security.*` for authentication and authorization.
* `jakarta.servlet.*` and `jakarta.servlet.http.*` for HTTP request/response filtering.

---

## 🔐 Class Declaration

```java
@Component
public class JwtRequestFilter extends OncePerRequestFilter
```

* Annotated with `@Component` so Spring can register it automatically.
* Extends `OncePerRequestFilter` to ensure a single execution per request.

---

## 🛠 Constructor

```java
public JwtRequestFilter(JwtConfig jwtConfig)
```

Injects `JwtConfig` for token validation and claims extraction.

---

## 🚫 Exclusion of Certain Routes

```java
@Override
protected boolean shouldNotFilter(HttpServletRequest request)
```

Skips JWT validation for routes starting with `/internal`.

---

## 🔄 Core Logic – `doFilterInternal`

This is where the filtering, extraction, and authentication logic lives.

### 🔍 Token Extraction Order:

1. **Custom Header:** `x-user-token`
2. **Standard Header:** `Authorization: Bearer <token>`
3. **Cookies:**

   * For admin paths (`/v1/admin/**`): looks for `adminDeskCookie`
   * For others: looks for `userDeskToken`

### 🧾 Claims Extraction & Validation:

```java
if (jwtConfig.validateToken(token))
```

* If the token is valid, extract:

   * **Email** (subject)
   * **Roles** (as a list of authorities)

If token is missing or invalid, returns a JSON 401 error response:

```json
{"error": "Unauthorized Request: You're not allowed here"}
```

### ✅ Setting Security Context:

```java
UsernamePasswordAuthenticationToken authToken = ...
SecurityContextHolder.getContext().setAuthentication(authToken);
```

* Builds an authentication object and sets it into the Spring Security context if valid email & roles are found.

---

## ⚠️ Error Handling

Catches and logs specific JWT exceptions:

* `ExpiredJwtException`: Token is expired.
* `MalformedJwtException`: Token format is wrong.
* `UnsupportedJwtException`: Token is not supported.
* `SignatureException`: Signature doesn’t match.
* `IllegalArgumentException`: Empty or invalid claims.

---

## 🧠 Summary

This filter authenticates requests using **JWT tokens** provided in:

* `x-user-token` header
* `Authorization` header
* Cookies (`adminDeskCookie` or `userDeskToken`)

If a valid JWT is found and verified, user identity and roles are extracted and stored in the **Spring SecurityContext**. This enables **role-based authorization** in secured routes.

---

## 🧾 Pseudocode

```plaintext
BEGIN doFilterInternal

  Extract request path and headers

  TRY to get token in order:
    1. x-user-token header
    2. Authorization header (Bearer)
    3. Cookie (adminDeskCookie or userDeskToken)

  IF token is missing:
    RETURN 401 Unauthorized JSON

  TRY to validate token:
    - IF valid, extract email and roles from claims
    - ELSE, skip setting security context

  IF email is present AND security context not already set:
    - Build authorities from roles
    - Set authentication into SecurityContextHolder

  Continue filter chain

END
```

---

