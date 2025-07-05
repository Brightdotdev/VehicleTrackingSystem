This is the real security muscle of your app — the backbone behind login, password hashing, and access control.

Here’s a clean Markdown doc for it:

---

### ✅ `docs/config/security-config.md` — Spring Security Configuration

```md
# 🔐 SecurityConfig — Spring Security Setup

This configuration class defines how your application handles **authentication**, **authorization**, and **password encoding** using Spring Security.

---

## 📦 Package

```

com.example.AuthService.Config.SecurityConfig

````

---

## 🧱 Annotations

| Annotation             | Purpose                                                                 |
|------------------------|-------------------------------------------------------------------------|
| `@Configuration`       | Declares this class as a Spring config class.                           |
| `@EnableWebSecurity`   | Enables Spring Security’s web features.                                 |
| `@EnableMethodSecurity`| Enables use of `@PreAuthorize` and `@PostAuthorize` annotations.        |

---

## 🧪 Beans Defined

### 🔑 `PasswordEncoder`
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
````

* Uses BCrypt (a one-way hash function) to encode passwords.
* Required for secure password handling.
* Injected into `DaoAuthenticationProvider`.

---

### 🔐 `AuthenticationProvider`

```java
@Bean
public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
}
```

* Tells Spring Security how to authenticate users:

    * **userDetailService** provides user data.
    * **passwordEncoder** compares password hashes.

---

### 🧠 `AuthenticationManager`

```java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
```

* Exposes the `AuthenticationManager` for manual use (e.g. login services).
* Spring handles user validation here.

---

### 🚨 `SecurityFilterChain`

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(authz -> authz
            .requestMatchers("/v1/auth/**", "/", "/error").permitAll()
            .anyRequest().authenticated()
        );
    return http.build();
}
```

* Disables CSRF (because you’re using JWTs or token-based auth).
* Allows unauthenticated access to:

    * `/v1/auth/**` → All login/signup endpoints
    * `/` and `/error` → Home and error pages
* Requires authentication for everything else.

---

## 🔁 Dependency Injection

### 🔄 `@Lazy UserDetailService`

```java
@Autowired
@Lazy
private UserDetailService userDetailService;
```

* `@Lazy` avoids circular dependencies — helpful if `UserDetailService` depends on security beans.

---

## 🔐 Security Flow Summary

| Step             | Component                   | Purpose                          |
| ---------------- | --------------------------- | -------------------------------- |
| Password hashing | `BCryptPasswordEncoder`     | Hashes passwords                 |
| Auth validation  | `DaoAuthenticationProvider` | Validates credentials            |
| Manager exposure | `AuthenticationManager`     | Authenticates users in services  |
| Security rules   | `SecurityFilterChain`       | Routes open vs. protected access |

---

## 🔥 Example Usage in a Service

```java
Authentication auth = authenticationManager.authenticate(
    new UsernamePasswordAuthenticationToken(email, password)
);
```

---

## 🚨 Notes

* CSRF is disabled — don’t enable it unless you’re using sessions or forms.
* You **must** hash passwords on registration using `passwordEncoder.encode(...)`.

---

## 📁 Related Classes

* [`UserDetailService`](../Services/UserDetailService.md)
* [`JwtConfig`](./JwtConfig.md)
* [`CookieGenerationHandler`](../handlers/cookie-handler.md)

---

## ✅ Summary

| Bean                     | Purpose                               |
| ------------------------ | ------------------------------------- |
| `PasswordEncoder`        | Secure password storage               |
| `AuthenticationProvider` | Credential validation via UserDetails |
| `AuthenticationManager`  | Used for manual login                 |
| `SecurityFilterChain`    | Determines who can access what        |


