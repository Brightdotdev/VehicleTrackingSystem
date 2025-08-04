## 📦 Package

```
com.example.AuthService.Config.SecurityConfig

````

---

## 🧱 Key Annotations

| Annotation               | Purpose                                                             |
|--------------------------|---------------------------------------------------------------------|
| `@Configuration`         | Declares this class as a Spring configuration class.               |
| `@EnableWebSecurity`     | Enables Spring Security’s web-based security features.             |
| `@EnableMethodSecurity`  | Enables annotations like `@PreAuthorize` for method-level security.|

---

## 🧪 Defined Beans

### 🔐 PasswordEncoder

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
````

* Uses **BCrypt** hashing algorithm.
* Ensures secure password storage.

---

### 🔑 AuthenticationProvider

```java
@Bean
public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
}
```

* Integrates with your custom `UserDetailService`.
* Leverages BCrypt for password comparison.
* Used during login to verify credentials.

---

### 🧠 AuthenticationManager

```java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
```

* Exposes Spring's internal `AuthenticationManager` so you can call it in your service (e.g. login).

---

### 🛡️ SecurityFilterChain

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    httpSecurity
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/v1/auth/**").permitAll()
            .requestMatchers("/").permitAll()
            .requestMatchers("/internal/**").authenticated()
            .requestMatchers("/error").permitAll()
            .anyRequest().authenticated());
    return httpSecurity.build();
}
```

* **CSRF disabled** — you're using token-based auth, not form login.
* **Public endpoints**:

  * `/v1/auth/**` → login, registration
  * `/` → optional welcome or health check
  * `/error` → allows Spring Boot to return standard error page
* **Internal endpoints**:

  * `/internal/**` now requires authentication — enforced via token
* **All other endpoints** → protected

---

## 🧠 Dependency Injection

```java
@Autowired
@Lazy
private UserDetailService userDetailService;
```

* `@Lazy` helps avoid circular dependency if the user service needs any security beans.

---

## 🔁 How It Works

| Component                   | Role                                       |
| --------------------------- | ------------------------------------------ |
| `BCryptPasswordEncoder`     | Password hashing                           |
| `DaoAuthenticationProvider` | Validates credentials using DB and encoder |
| `AuthenticationManager`     | Called explicitly for manual login/auth    |
| `SecurityFilterChain`       | Defines access control for each endpoint   |

---

## 🔥 Usage Example in a Login Service

```java
Authentication auth = authenticationManager.authenticate(
    new UsernamePasswordAuthenticationToken(email, password)
);
```

---

## 🚨 Security Notes

* You **must** encode passwords during registration:

  ```java
  user.setPassword(passwordEncoder.encode(rawPassword));
  ```

* All `/internal/**` endpoints now **require authentication** — typically done using JWT and API key strategies across services.

---

## 📁 Related Configs

* [`UserDetailService`](../Services/UserDetailService.md)
* [`JwtConfig`](./JwtConfig.md)

---

## ✅ Summary

| Bean                     | Description                            |
| ------------------------ | -------------------------------------- |
| `PasswordEncoder`        | Secure password hashing with BCrypt    |
| `AuthenticationProvider` | Uses user service + encoder for login  |
| `AuthenticationManager`  | Exposed manually for use in services   |
| `SecurityFilterChain`    | Declares which endpoints are protected |

---
