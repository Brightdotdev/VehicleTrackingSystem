## 🔐 `JwtRequestFilter` Documentation

> **Purpose:**
> This filter intercepts every incoming HTTP request, extracts the JWT from headers or cookies, validates it, and if valid, sets the security context for the authenticated user. It supports both **user and admin authentication** via multiple token locations.

---

### 📦 Class Overview

```java
@Component
public class JwtRequestFilter extends OncePerRequestFilter
```

* Extends `OncePerRequestFilter` to ensure it's only executed once per request.
* Annotated with `@Component` for Spring's component scanning.

---

### 🧪 Dependencies

* `JwtConfig`: Custom class responsible for JWT parsing and validation.
* `Logger`: SLF4J Logger for debug/error logging.

---

### 🔄 Token Retrieval Strategy (Priority Order)

| Source                 | Details                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| `x-user-token` header  | Primary source of token                                                |
| `Authorization` header | Fallback if `x-user-token` is missing; expects format `Bearer <token>` |
| Cookie                 | Last fallback; uses `userDeskToken` or `adminDeskCookie` based on path |

> Admin routes must begin with `/v1/admin` to be considered for `adminDeskCookie`.

---

### 🧠 Core Logic

1. **Extract path and headers:**

   ```java
   final String path = request.getRequestURI();
   final String headerEmail = request.getHeader("x-user-email");
   ```

2. **Attempt to get token from header/cookie:**

   * Check `x-user-token`
   * Fallback to `Authorization: Bearer <token>`
   * Fallback to cookies based on route:

      * `/v1/admin` → `adminDeskCookie`
      * others → `userDeskToken`

3. **Validate and extract claims from the token using `jwtConfig`:**

   ```java
   Claims claims = jwtConfig.getClaims(token);
   ```

4. **Extract user roles and build Spring `SimpleGrantedAuthority` list.**

5. **Set `SecurityContext` if authentication is valid.**

6. **If token is invalid or not present:** Return a 401 response with a JSON error.

---

### ❌ Error Handling

* Gracefully logs and continues on common JWT issues:

   * `ExpiredJwtException`
   * `MalformedJwtException`
   * `UnsupportedJwtException`
   * `SignatureException`
   * `IllegalArgumentException`
* If token is completely missing → returns a custom 401 Unauthorized JSON response:

  ```json
  {
    "error": "Unauthorized Request: You're not allowed here"
  }
  ```

---

### ✅ Example Valid Token Use Case

* Request contains:

  ```
  x-user-token: <valid-jwt>
  x-user-email: user@example.com
  x-user-roles: USER
  ```

* Token is parsed, roles extracted, and `SecurityContextHolder` is populated with:

  ```java
  new UsernamePasswordAuthenticationToken("user@example.com", null, List.of("ROLE_USER"))
  ```

---

### 🔐 Summary

| Feature                      | Supported ✅ |
| ---------------------------- | ----------- |
| Header-based JWT             | ✅           |
| Cookie-based JWT             | ✅           |
| Admin/User route distinction | ✅           |
| Role-based authorities       | ✅           |
| Stateless JWT Auth           | ✅           |
| Error resilience             | ✅           |


