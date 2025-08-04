

# 🧑‍💼 `UserHandler` — Authenticated User Utility Service

Located in: `com.tracker.loggingtrackingservice.G.V1.Config`

This class provides methods for accessing **user-specific information** extracted from a validated JWT and stored in Spring Security’s `SecurityContext`.

It is registered as a **Spring service** with the name `userHandlerService` for use in:

* Service logic
* Controller methods
* `@PreAuthorize` expressions (e.g., `@PreAuthorize("@userHandlerService.getRoles().contains('ROLE_ADMIN')")`)

---

## 🔑 Purpose

Helps safely and consistently extract:

* The current user’s **username/email**
* Their **roles/authorities**
* The optional **user image**, passed through JWT claims

---

## 🧩 Methods

### 🧍 `String getCurrentUser()`

```java
public String getCurrentUser()
```

Returns the `authentication.getName()` (i.e., the **subject** in the JWT).

> Typically this is the user's **email** or **unique username**.

---

### 🛡️ `List<String> getRoles()`

```java
public List<String> getRoles()
```

Returns the list of roles or authorities from the current user:

* Extracts `GrantedAuthority` values and returns as `List<String>`.
* Roles are typically in the format: `ROLE_USER`, `ROLE_ADMIN`, etc.

---

### 🖼️ `String getUserImage()`

```java
public String getUserImage()
```

Returns the value of the custom `userImage` claim, **if present**.

* In your filter (`JwtRequestFilter`), the `userImage` is stored in `authentication.setDetails(Map)`
* This method checks if details are a `Map`, then reads the `"userImage"` field

**Returns:** Image string (could be a URL or Base64), or `null` if not found.

---

## ✅ Example Use

### In a Service

```java
@Autowired
private UserHandler userHandler;

public void logAction() {
    String user = userHandler.getCurrentUser();
    List<String> roles = userHandler.getRoles();
    String avatar = userHandler.getUserImage();
}
```

### In a Controller

```java
@GetMapping("/profile")
public ResponseEntity<?> getProfile() {
    String email = userHandler.getCurrentUser();
    String image = userHandler.getUserImage();
    return ResponseEntity.ok(Map.of("email", email, "image", image));
}
```

### In SpEL / `@PreAuthorize`

```java
@PreAuthorize("@userHandlerService.getRoles().contains('ROLE_ADMIN')")
```

---

## 🧠 Summary

| Method             | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `getCurrentUser()` | Returns current user's username (usually email)                     |
| `getRoles()`       | Returns list of user's authorities from JWT                         |
| `getUserImage()`   | Retrieves custom image from JWT claims via `authentication.details` |

---

