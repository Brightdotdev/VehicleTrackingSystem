


# 🛡️ JwtAuthenticationFilter

## 📌 Purpose

`JwtAuthenticationFilter` is a **global Spring Cloud Gateway filter** that intercepts incoming requests and **authenticates them via JWT** (JSON Web Tokens). It validates the token, extracts user information, and attaches it as headers before forwarding the request to the appropriate downstream service.

---

## ⚙️ Class Overview

```java
@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {
````

* `@Component`: Registers this class as a Spring-managed bean.
* Implements `GlobalFilter`: Applies to **all** incoming HTTP requests.
* Implements `Ordered`: Ensures it runs **early** in the filter chain (with priority `-1`).

---

## 🔐 Authentication Logic: Step-by-Step

### ✅ 1. Bypass Public Routes

```java
if (path.startsWith("/internal") ||
    path.contains("/v1/auth/") ||
    path.contains("/v1/oauth/")) {
    return chain.filter(exchange);
}
```

These paths are considered public or already handled by another auth mechanism — we skip filtering for them.

---

### 🕵️ 2. Extract Token (Header or Cookie)

#### For Admin Paths (`/v1/admin/**`):

* First try `Authorization: Bearer <token>`
* Fallback: cookie named `adminDeskCookie`

#### For User Paths:

* First try `Authorization` header
* Then try `userDeskToken` cookie
* Lastly, fallback to `adminDeskCookie` if still no token

```java
if (isAdminEndpoint) {
    if (token == null) {
        token = getJwtFromCookies(request, "adminDeskCookie");
    }
} else {
    if (token == null) {
        token = getJwtFromCookies(request, "userDeskToken");
    }
    if (token == null && getJwtFromCookies(request, "adminDeskCookie") != null) {
        token = getJwtFromCookies(request, "adminDeskCookie");
    }
}
```

If no token is found at all, the filter responds with a **401 Unauthorized** error.

---

### 🧪 3. Parse and Validate JWT

```java
SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

Jws<Claims> jws = Jwts.parser()
    .setSigningKey(secretKey)
    .build()
    .parseClaimsJws(token);
```

* Uses HMAC SHA signing with secret from environment variable: `auth.jwt.secret`
* If token is invalid or expired → catches the error and responds with 401

---

### 📦 4. Extract Claims

```java
Claims claims = jws.getBody();
String subject = claims.getSubject(); // typically user email or ID
Object claim = claims.get("roles");   // user role(s), currently unused
```

---

### 🔁 5. Attach Custom Headers

These headers are added to the request before passing to the downstream microservice:

```java
ServerHttpRequest modifiedRequest = request.mutate()
    .header("x-user-email", subject)
    .header("x-user-token", token)
    .build();
```

---

### ❌ 6. Handle Unauthorized Requests

If token is missing or invalid, the filter builds this JSON response:

```json
{
  "error": "Unauthorized: Missing or invalid token"
}
```

With `401 UNAUTHORIZED` status.

---

## 🍪 Helper: Cookie Parser

```java
private String getJwtFromCookies(ServerHttpRequest request, String cookieName)
```

* Loops through all cookie headers
* Splits each cookie and matches it against `cookieName=...`
* Returns the token string if found

---

## 📐 Filter Order

```java
@Override
public int getOrder() {
    return -1;
}
```

* Lower numbers = higher priority
* `-1` means it runs **early** in the request lifecycle — before routing

---

## 🔁 Flow Summary (Pseudocode)

```
if path is public (auth/internal/oauth):
    pass the request through

else:
    try extract token from Authorization header
    if not found:
        try cookie based on user/admin

    if still no token:
        respond with 401 Unauthorized

    else:
        parse JWT using secret
        if invalid/expired:
            respond with 401 Unauthorized

        else:
            extract subject & roles
            add headers x-user-email & x-user-token
            forward request to next service
```

---

## 🛠️ Future Improvements

* Attach `x-user-roles` header from JWT roles claim
* Use proper `Claims` casting to handle roles as `List<String>`
* Log request path and token status for better debugging
* Consider adding role-based route validation (e.g. reject user token on admin route)

---

## 🧪 Testing Scenarios

| Scenario                    | Expected Result      |
| --------------------------- | -------------------- |
| Valid token in header       | Request forwarded    |
| Valid token in cookie       | Request forwarded    |
| No token anywhere           | 401 Unauthorized     |
| Expired or invalid token    | 401 Unauthorized     |
| Admin path, user token only | (currently allowed)  |
| Missing subject in token    | Likely 401, or error |

---

## 📁 Location

This file lives in:

```
src/main/java/com/example/ApiGateway/JwtAuthenticationFilter.java
```

---

## 🧠 Author

* Bright Akinola – Lead Gateway Dev
---
