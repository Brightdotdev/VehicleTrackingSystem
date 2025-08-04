
# 🔐 `JwtRequestFilter` — JWT Authentication Filter

Located in: `com.example.DispatchService.Config`

This class is a **custom security filter** extending Spring Security’s `OncePerRequestFilter`. It intercepts incoming HTTP requests and performs:

* JWT extraction (from headers and cookies)
* Token validation
* Claim extraction (user info, roles, etc.)
* Security context setup for authenticated users

---

## 🔁 Lifecycle

This filter runs **once per request**. It executes *before* the controller handles any incoming request.

---

## 💡 Key Responsibilities

1. **Extract JWT** from multiple sources:

    * `x-user-token` (custom header)
    * `Authorization` header (standard Bearer token)
    * Cookies (`userDeskToken`, `adminDeskCookie`)

2. **Validate JWT** using `JwtConfig`.

3. **Extract Claims**:

    * `subject` (email)
    * `roles` (permissions)
    * `userImage` (optional extra)

4. **Build Authentication Token**:

    * Sets Spring Security's `SecurityContext` with user credentials and roles.

5. **Reject Unauthorized Access** if token is missing or invalid.

---

## 🔎 Breakdown of JWT Extraction Strategy

Order of token resolution:

1. **Header**: `x-user-token`
2. **Header (Fallback)**: `Authorization: Bearer <token>`
3. **Cookie (Admin)**: `adminDeskCookie` (only if path starts with `/v1/admin`)
4. **Cookie (User)**: `userDeskToken` (for non-admin routes)

```java
String token = request.getHeader("x-user-token");

// Fallback to Authorization header
if (token == null) {
    // Extract from Bearer token
}

// Fallback to Cookies (user/admin path-sensitive)
```

---

## 🔒 Authentication Flow

Once the token is validated and claims are extracted:

* User email and roles are parsed
* Roles are prefixed with `ROLE_` and added as `SimpleGrantedAuthority`
* The authenticated user is stored in Spring’s `SecurityContextHolder`

```java
UsernamePasswordAuthenticationToken authToken =
    new UsernamePasswordAuthenticationToken(email, null, authorities);
```

---

## ⚠️ Error Handling

Logs warning messages for the following issues:

| Exception                  | Description                           |
| -------------------------- | ------------------------------------- |
| `ExpiredJwtException`      | Token has expired                     |
| `MalformedJwtException`    | Token is not in valid JWT format      |
| `UnsupportedJwtException`  | Token uses unsupported algorithm      |
| `SignatureException`       | Token signature does not match secret |
| `IllegalArgumentException` | General argument issues               |

If no valid token is found:

* Returns `401 Unauthorized` with JSON message:

  ```json
  {"error": "Unauthorized Request: You're not allowed here"}
  ```

---

## 🔄 Method Summary

| Method                        | Purpose                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `doFilterInternal()`          | Main entry point for filtering request. Extracts, validates, sets authentication. |
| `JwtRequestFilter(JwtConfig)` | Constructor injection of JWT configuration class.                                 |

---

## 📌 Sample Request Headers

```http
GET /v1/user/dashboard HTTP/1.1
Host: example.com
Authorization: Bearer eyJhbGciOi...
x-user-email: john@example.com
x-user-roles: USER
```

OR

```http
Cookie: userDeskToken=eyJhbGciOi...
```

---

## ✅ Authentication Result

If token is valid:

* User is authenticated.
* Roles are assigned in the `SecurityContext`.
* Controllers and services can access user details from security context.

---

## 🚫 Authentication Failure

If token is missing or invalid:

* Filter halts the chain.
* Sends `401` response with error message.
* Prevents downstream processing of protected endpoints.

---

## 🧪 Example Usage 

```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String email = (String) auth.getPrincipal(); // Extracted email
List<GrantedAuthority> roles = (List<GrantedAuthority>) auth.getAuthorities();
```

---


