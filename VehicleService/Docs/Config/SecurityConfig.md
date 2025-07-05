# 🔐 Security Configuration – `SecurityConfig.java`

This configuration class sets up Spring Security for the **VehicleService** application using **stateless JWT-based authentication**. It disables default session mechanisms and ensures that all routes are appropriately protected, with JSON-based error responses for unauthorized or forbidden access.

---

## 📦 Package

```java
package com.example.VehicleService.Config;
```

---

## 🧩 Annotations

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
```

* **@Configuration**: Marks this as a Spring configuration class.
* **@EnableWebSecurity**: Enables Spring Security’s web security support.
* **@EnableMethodSecurity**: Allows method-level security using annotations like `@PreAuthorize`.

---

## 🔐 Security Filter Chain Bean

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http, JwtRequestFilter jwtRequestFilter)
```

This method defines the security behavior of the application.

### ✅ Disabled Defaults

```java
.csrf(AbstractHttpConfigurer::disable)
.formLogin(AbstractHttpConfigurer::disable)
.logout(AbstractHttpConfigurer::disable)
.httpBasic(AbstractHttpConfigurer::disable)
```

* Disables **CSRF**, **form login**, **logout**, and **HTTP Basic auth** since the application uses token-based authentication.

### ⚙️ Session Management

```java
.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
)
```

* Sets the session creation policy to **STATELESS**, meaning Spring won’t store any sessions server-side.

### 🔓 Request Authorization

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/public/**").permitAll()
    .requestMatchers("/v1/admin/vehicle/**").authenticated()
    .requestMatchers("/v1/user/vehicle/**").authenticated()
    .requestMatchers("/internal/**").permitAll()
    .requestMatchers("/error").permitAll()
    .anyRequest().authenticated()
)
```

* Public endpoints are **open to all** (`/public/**`, `/internal/**`, `/error`).
* Admin/user vehicle routes require **authentication**.
* Any other route is also **secured by default**.

### ❌ Custom Error Handling

```java
.exceptionHandling(exception -> exception
    .authenticationEntryPoint((request, response, authException) -> {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Unauthorized - please provide a valid token.\"}");
    })
    .accessDeniedHandler((request, response, accessDeniedException) -> {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Forbidden - you don’t have permission to access this resource.\"}");
    })
)
```

* Customizes responses for:

    * **401 Unauthorized**
    * **403 Forbidden**
* Returns **JSON error objects** for frontend compatibility.

### 🧱 JWT Filter Integration

```java
.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
```

* Adds a **JWT filter** to run **before** Spring’s default `UsernamePasswordAuthenticationFilter`.

---

## 🛡️ JwtRequestFilter Bean

```java
@Bean
public JwtRequestFilter jwtRequestFilter(JwtConfig jwtConfig)
```

* Registers the **JWT validation filter** using provided configuration.

---

## 👤 In-Memory User Details Manager

```java
@Bean
public UserDetailsService userDetailsService()
```

* Returns a default empty **InMemoryUserDetailsManager** — useful for testing but can be replaced with a DB-backed service.

---

## 🧠 Summary

This configuration enforces **stateless, token-based security** for the application. It ensures that:

* Only allowed endpoints are public.
* JWT tokens are required for secured endpoints.
* Default login mechanisms and session states are disabled.
* Errors are returned in a **clear JSON format**.
* A JWT filter inspects requests for authentication.

---

## 🧾 Pseudocode

```
BEGIN Security Configuration

DISABLE CSRF, form login, logout, HTTP Basic

SET session management to STATELESS

DEFINE route access:
    PERMIT: /public/**, /internal/**, /error
    REQUIRE AUTH: /v1/admin/vehicle/**, /v1/user/vehicle/**, all others

SET custom error handlers:
    ON Unauthorized → return 401 with JSON message
    ON Forbidden → return 403 with JSON message

REGISTER JwtRequestFilter before UsernamePasswordAuthenticationFilter

RETURN the configured SecurityFilterChain

DEFINE bean: jwtRequestFilter(jwtConfig)
DEFINE bean: empty InMemoryUserDetailsManager

END
```

