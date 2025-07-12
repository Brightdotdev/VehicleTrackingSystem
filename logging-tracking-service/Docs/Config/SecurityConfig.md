## 🔐 `SecurityConfig` Documentation

> **Purpose:**
> This class configures **JWT-based stateless security** for your Spring Boot service using `SecurityFilterChain`. It protects endpoints based on user roles (`USER`, `ADMIN`) and integrates with your custom `JwtRequestFilter` for authentication.

---

### 📦 Class Overview

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig
```

* `@Configuration` — Marks the class as a source of bean definitions.
* `@EnableWebSecurity` — Enables Spring Security for web contexts.
* `@EnableMethodSecurity` — Enables `@PreAuthorize`, `@Secured`, and method-level annotations.

---

### 🔐 `filterChain(HttpSecurity, JwtRequestFilter)`

Configures how incoming HTTP requests are authenticated and authorized.

#### ✅ Key Configurations:

| Feature               | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `csrf`                | Disabled (no CSRF protection needed for stateless APIs) |
| `formLogin`, `logout` | Disabled (no session-based login)                       |
| `httpBasic`           | Disabled (token-based only)                             |
| `sessionManagement`   | Stateless (no session storage)                          |
| `exceptionHandling`   | Custom error responses for 401/403                      |
| `addFilterBefore`     | Adds custom JWT filter before Spring’s built-in filter  |

---

### 🔐 Endpoint Authorization Rules

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/public/**").permitAll()
    .requestMatchers("/v1/user/notifications/**").authenticated()
    .requestMatchers("/v1/sse/**").authenticated()
    .requestMatchers("/v1/user/tracking/**").authenticated()
    .requestMatchers("/v1/admin/notifications/**").hasRole("ADMIN")
    .requestMatchers("/error").permitAll()
    .anyRequest().authenticated()
)
```
---

### 🔥 Exception Handling

#### Unauthenticated (401)

```json
{
  "error": "Unauthorized - please provide a valid token."
}
```

#### Forbidden (403)

```json
{
  "error": "Forbidden - you don’t have permission to access this resource."
}
```

---

### 🧱 Beans

#### ✅ `JwtRequestFilter`

```java
@Bean
public JwtRequestFilter jwtRequestFilter(JwtConfig jwtConfig)
```

* Injected into the filter chain.
* Handles token validation and sets the SecurityContext.

#### ✅ `UserDetailsService`

```java
@Bean
public UserDetailsService userDetailsService()
```

* Required by Spring Security even if you don’t use it. Returns an empty in-memory store.

---

### 🔐 Summary

| Security Feature              | Configured ✅ |
| ----------------------------- | ------------ |
| Stateless session             | ✅            |
| JWT Token validation          | ✅            |
| Header & Cookie token support | ✅            |
| Custom error handling         | ✅            |
| Role-based route protection   | ✅            |
| CSRF protection (off)         | ✅            |
| Password-based auth           | ❌ (disabled) |
| Form login                    | ❌ (disabled) |

