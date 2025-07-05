

### 🧩 Overview

`CookieGenerationHandler` is a simple Spring `@Service` that generates secure `HttpOnly` JWT cookies for:

* **Regular Users** → `"userDeskToken"`
* **Admins** → `"adminDeskCookie"`

These cookies are crucial for maintaining stateless authentication on the frontend. They're secure, scoped site-wide, and automatically expire.

---

### 🔐 Cookie Security Policy

| Property   | Description                                                                 |
| ---------- | --------------------------------------------------------------------------- |
| `HttpOnly` | Prevents JavaScript access (✅ safer against XSS).                           |
| `Secure`   | Ensures cookie is only sent over HTTPS. ⚠️ Always set `true` in production. |
| `SameSite` | Controls cross-site sending of cookies. Use `None` for cross-origin setups. |
| `maxAge`   | Determines how long the cookie should persist.                              |
| `path="/"` | Ensures cookie is available to all routes in your app.                      |

---

### ⚙️ Method Descriptions

#### `createJwtCookie(String jwt): String`

Generates a cookie for **regular users**.

```java
String cookie = cookieHandler.createJwtCookie(jwt);
```

| Detail      | Value                     |
| ----------- | ------------------------- |
| Cookie Name | `userDeskToken`           |
| Lifespan    | `7 days`                  |
| Use Case    | Regular user login/signup |

---

#### `createAdminCooke(String jwt): String`

Generates a cookie for **admin accounts**.

```java
String adminCookie = cookieHandler.createAdminCooke(jwt);
```

| Detail      | Value              |
| ----------- | ------------------ |
| Cookie Name | `adminDeskCookie`  |
| Lifespan    | `3 days`           |
| Use Case    | Admin login/signup |





