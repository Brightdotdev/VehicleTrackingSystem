# 🛡️ JwtAuthenticationFilter

## 📌 Purpose

`JwtAuthenticationFilter` is a **global Spring Cloud Gateway filter** that intercepts all incoming HTTP requests. It handles:

* 🔐 **JWT validation** for user/admin authentication
* 🔑 **API key validation** for internal service-to-service calls
* 📨 Attaching identity headers to downstream services

---

## ⚙️ Class Overview

```java
@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {
```

* `@Component`: Registers this class as a Spring-managed bean
* `GlobalFilter`: Intercepts **all HTTP requests** before routing
* `Ordered`: Controls execution priority in the filter chain (`-1` = high priority)

---

## 🔐 Authentication Logic: Step-by-Step

### ✅ 1. Handle Internal Requests via API Key

```java
if (path.startsWith("/internal")) {
    String internalKey = request.getHeaders().getFirst("X-Internal-API-Key");

    if (internalKey == null || !internalKey.equals(internalApiKey)) {
        return unauthorizedResponse(exchange, "Unauthorized: Invalid internal API key");
    }

    return chain.filter(exchange); // internal request authorized
}
```

* Internal routes (e.g. `/internal/**`) must send a **custom header**:
  `X-Internal-API-Key: your-secret-key`
* The expected key is injected via:
  `auth.api.key` from `application.yml`

#### 🔑 Configuration in `application.yml`:

```yaml
auth:
  api:
    key: ${API_INTERNAL_KEY}
  jwt:
    secret: ${JWT_SECRET}
    expiration: ${JWT_EXP}
```

---

### 🚪 2. Bypass Public Auth Routes

```java
if (path.contains("/v1/auth/") || path.contains("/v1/oauth/")) {
    return chain.filter(exchange);
}
```

These routes are public — login, signup, OAuth — and don’t require filtering.

---

### 🕵️ 3. Extract JWT Token

#### 🔒 For Admin Paths (`/v1/admin/**`):

* Try `Authorization` header (Bearer)
* Fallback to `adminDeskCookie`

#### 👤 For User Paths:

* Try `Authorization` header
* Then `userDeskToken` cookie
* Lastly fallback to `adminDeskCookie` (for admin fallback use)

```java
if (isAdminEndpoint) {
    if (token == null) {
        token = getJwtFromCookies(request, "adminDeskCookie");
    }
} else {
    if (token == null) {
        token = getJwtFromCookies(request, "userDeskToken");
    }
    if (token == null) {
        token = getJwtFromCookies(request, "adminDeskCookie");
    }
}
```

If token is **still not found**, respond with `401 Unauthorized`.

---

### 🧪 4. Parse and Validate JWT

```java
SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

Jws<Claims> jws = Jwts.parser()
    .setSigningKey(secretKey)
    .build()
    .parseClaimsJws(token);
```

* Uses the secret from `auth.jwt.secret`
* Fails if token is malformed, expired, or signature is invalid

---

### 📦 5. Extract User Identity

```java
Claims claims = jws.getBody();
String subject = claims.getSubject(); // e.g. user email
Object claim = claims.get("roles");   // user roles (currently unused)
```

---

### 🔁 6. Attach Custom Headers for Downstream Services

```java
ServerHttpRequest modifiedRequest = request.mutate()
    .header("x-user-email", subject)
    .header("x-user-token", token)
    .build();
```

These are forwarded with the request so downstream services can identify the user.

---

### ❌ 7. Handle Unauthorized Cases

Returns:

```json
{
  "error": "Unauthorized: Missing or invalid token"
}
```

* HTTP status: `401 Unauthorized`
* Triggered when token is missing, invalid, or API key check fails (for internal)

---

## 🍪 Cookie Helper Function

```java
private String getJwtFromCookies(ServerHttpRequest request, String cookieName)
```

* Iterates over cookies in request header
* Matches by cookie name and extracts value

---

## 📐 Filter Order

```java
@Override
public int getOrder() {
    return -1;
}
```

* Runs early in the chain before routing or further processing
* Ensures that all routing decisions happen **after authentication**

---

## 🔁 Full Filter Flow (Updated Pseudocode)

```
if path starts with /internal:
    if X-Internal-API-Key header is present and valid:
        allow request
    else:
        respond 401 Unauthorized

else if path is public (/v1/auth, /v1/oauth):
    allow request

else:
    try to get JWT from Authorization header
    if not found:
        try user/admin cookies

    if still not found:
        respond 401 Unauthorized

    try parse JWT
    if expired/invalid:
        respond 401 Unauthorized

    extract claims (subject, roles)
    attach x-user-email and x-user-token headers
    forward request to downstream service
```

---

## 🛠️ Future Improvements

* ✔️ Attach `x-user-roles` header from JWT claims
* 🔄 Add role-based access control (e.g. block user token on `/v1/admin/**`)
* 🪵 Log JWT issuer, subject, or token lifespan for monitoring
* ❗ Optional: support token refresh headers or custom claim mapping

---

## 🧪 Testing Scenarios

| Scenario                         | Expected Result          |
| -------------------------------- | ------------------------ |
| Valid internal API key           | ✅ Request forwarded      |
| Invalid/missing internal API key | ❌ 401 Unauthorized       |
| Valid JWT in header              | ✅ Request forwarded      |
| Valid JWT in cookie              | ✅ Request forwarded      |
| No token anywhere                | ❌ 401 Unauthorized       |
| Expired or invalid JWT           | ❌ 401 Unauthorized       |
| Admin route with user token      | ✅ (if not validated yet) |
| Missing `sub` in token           | ❌ 401 or NullPointer     |

---

## 📁 Location

```
src/main/java/com/example/ApiGateway/JwtAuthenticationFilter.java
```

---

## 🧠 Author
**Bright Akinola**