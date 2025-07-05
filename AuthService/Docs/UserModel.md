
### 🧩 Overview

`UserModel` represents the core user entity in the authentication service. It integrates directly with Spring Security by implementing the `UserDetails` interface and persists to a database via JPA.

---

### 🧬 Fields

| Field         | Type           | Description                                               |
| ------------- | -------------- | --------------------------------------------------------- |
| `id`          | `int`          | Primary key                                               |
| `email`       | `String`       | Unique user email. Required, validated.                   |
| `name`        | `String`       | Display name. Required.                                   |
| `password`    | `String`       | Encoded password. May be null for OAuth users.            |
| `userImage`   | `String`       | URL or path to profile image                              |
| `provider`    | `String`       | Source of account (e.g., `LOCAL_USER`, `GOOGLE_USER_123`) |
| `roles`       | `List<String>` | User roles like `ROLE_USER`, `ROLE_ADMIN`                 |
| `isValidated` | `boolean`      | Whether the user's email is verified                      |

---

### 🔐 Security Integration (`UserDetails`)

Implements Spring Security’s `UserDetails`, providing:

| Method                      | Behavior                             |
| --------------------------- | ------------------------------------ |
| `getAuthorities()`          | Converts role strings to authorities |
| `getPassword()`             | Returns hashed password              |
| `getUsername()`             | Uses email as username               |
| `isAccountNonExpired()`     | Always `true`                        |
| `isAccountNonLocked()`      | Always `true`                        |
| `isCredentialsNonExpired()` | Always `true`                        |
| `isEnabled()`               | Always `true`                        |

You can override those 4 booleans if you ever want to soft-disable users or implement ban/lock policies.

---

### 🚨 Warnings & Suggestions

| Issue                  | Suggestion                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ❌ `setUserImage()` bug | This line: `this.userImage = UserModel.this.userImage;` will cause recursion. Should be `this.userImage = userImage;` |
| 🔁 DRY                 | `setUsername(String)` duplicates `setEmail(String)` — consider removing it unless required by external code           |
| 🔐 Validation logic    | `isValidated` is tracked but never enforced in `isEnabled()` or login flow — consider tying it to account access      |

---

### ✅ Sample Usage

```java
UserModel user = new UserModel();
user.setEmail("test@example.com");
user.setPassword(passwordEncoder.encode("securePassword"));
user.setName("Bright");
user.setRoles(List.of("ROLE_USER"));
user.setValidated(true);
```

---

## 🧾 Suggested Javadoc Comments

Paste these above the class and key methods:

```java
/**
 * Represents a user entity in the system.
 * Implements Spring Security's UserDetails for authentication.
 */
@Entity
public class UserModel implements UserDetails {
```

```java
/**
 * Returns a list of Spring Security authorities derived from user's roles.
 *
 * @return List of GrantedAuthority
 */
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
```

```java
/**
 * Indicates whether the account is enabled for login.
 * You can tie this to email validation if needed.
 */
@Override
public boolean isEnabled() {
    return true; // optionally: return isValidated;
}
```


