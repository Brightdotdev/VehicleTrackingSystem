# 🛡️ `SecurityConfig` — Spring Security Configuration

Located in: `com.example.DispatchService.Config`

This class configures **Spring Security** for your Dispatch Service app using a **stateless JWT-based** authentication model.

It ensures:

* Only specific routes are public.
* All others require a valid JWT.
* Unauthorized/Forbidden responses return JSON.
* CSRF/session-based login is disabled.

---

## 📌 Overview

* ✅ Enables `@PreAuthorize` and `@Secured` via `@EnableMethodSecurity`
* ✅ Uses a custom `JwtRequestFilter` for validating tokens on every request
* 🚫 Disables stateful features (session, CSRF, form login, etc.)
* ✅ Defines access rules by URL patterns

---

## 🔁 `SecurityFilterChain` Configuration

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http, JwtRequestFilter jwtRequestFilter)
```

### 🔐 Security Customizations:

| Feature    | Setting                                       |
| ---------- | --------------------------------------------- |
| CSRF       | Disabled                                      |
| Form Login | Disabled                                      |
| Logout     | Disabled                                      |
| Basic Auth | Disabled                                      |
| Sessions   | Stateless (`SessionCreationPolicy.STATELESS`) |

---

### 🔓 Public Endpoints

```java
.requestMatchers("/public/**").permitAll()
.requestMatchers("/error").permitAll()
```

These routes **do not require authentication**.

---

### 🔒 Protected Endpoints

```java
.requestMatchers("/v1/user/dispatch/**").authenticated()
.requestMatchers("/v1/admin/dispatch/**").authenticated()
.anyRequest().authenticated()
```

All other requests **must include a valid JWT**.

---

### 🚨 Exception Handling

| Scenario                              | Response           |
| ------------------------------------- | ------------------ |
| 🔑 No token or invalid token          | `401 Unauthorized` |
| 🚫 Authenticated but lacks permission | `403 Forbidden`    |

**Response format (JSON):**

```json
{
  "error": "Unauthorized - please provide a valid token."
}
```

or

```json
{
  "error": "Forbidden - you don’t have permission to access this resource."
}
```

---

### 🧱 Filters

```java
.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
```

Inserts my custom [`JwtRequestFilter`](JwtRequestFilter.md) **before** Spring's default login filter to validate JWTs on every request.

---

## 🧪 Other Beans

### 🔁 `JwtRequestFilter`

```java
@Bean
public JwtRequestFilter jwtRequestFilter(JwtConfig jwtConfig)
```

Registers the JWT filter into the Spring context.

---

### 🧍 `UserDetailsService`

```java
@Bean
public UserDetailsService userDetailsService()
```

Provides a basic in-memory user manager (not currently used, but required for Spring Security initialization). Replace with real logic if you want role-based authorities from DB.

---

## 🧠 Summary

| Component             | Description                                 |
| --------------------- | ------------------------------------------- |
| `SecurityFilterChain` | Defines the security rules and integrations |
| `JwtRequestFilter`    | Extracts and validates the JWT token        |
| `Exception Handling`  | Custom JSON for 401 and 403 responses       |
| `Session Policy`      | Stateless: No sessions, tokens only         |

---

## ✅ Sample Token-Protected Call

```http
GET /v1/user/dispatch/list HTTP/1.1
Authorization: Bearer eyJhbGciOi...
```

If token is valid:

* SecurityContext will contain authenticated user.

---

