
# 📦 AuthService DTOs

This document covers all record-based DTOs in `com.example.AuthService.Utils.UtilRecords`.

Each DTO includes:

- 🧠 Purpose
- 📥 Fields and validation logic
- 📌 Where/when it's used (if known)

---

## 🔐 LoginServiceResponse

### ✅ Purpose

Internal response object combining user model, authentication result, and user image after login.

```java
record LoginServiceResponse(
    UserModel user,
    Authentication auth,
    String userImage
)
````

* **user**: the actual UserModel entity
* **auth**: Spring Security's Authentication result
* **userImage**: profile image string

🧪 **Validation**: None (used internally)

---

## 👤 UserLocalSignUp

### ✅ Purpose

Used for **regular user registration**.

```java
record UserLocalSignUp(
    String name,
    String image,
    String email,
    String password
)
```

### 🔎 Validations

* `name`: required, non-blank
* `email`: required, must match regex
* `password`: required, ≥ 6 characters

---

## 🧑‍💼 AdminLocalSignUp

### ✅ Purpose

Used for **admin user registration**.

```java
record AdminLocalSignUp(
    String name,
    String adminKey,
    String email,
    String password
)
```

### 🔎 Validations

* `name`: required
* `adminKey`: must not be blank
* `email`: required, valid format
* `password`: required, ≥ 6 characters

---

## 🔓 LocalLogin

### ✅ Purpose

Regular user login via email/password.

```java
record LocalLogin(
    String email,
    String password
)
```

### 🔎 Validations

* `email`: required, valid format
* `password`: required

---

## 🛡️ AdminLocalLogin

### ✅ Purpose

Admin login via key + credentials.

```java
record AdminLocalLogin(
    String adminKey,
    String email,
    String password
)
```

### 🔎 Validations

* `adminKey`: required
* `email`: required, valid format
* `password`: required

---

## 🌐 UserGoogleSignUp

### ✅ Purpose

Used when signing up a **user** via Google OAuth.

```java
record UserGoogleSignUp(
    String name,
    String email,
    boolean email_verified,
    String sub,
    String picture
)
```

### 🔎 Validations

* `email_verified` must be true
* `sub` = Google user ID (required)
* All fields required and validated

---

## 👮 AdminGoogleSignUp

### ✅ Purpose

Admin signup via Google.

```java
record AdminGoogleSignUp(
    String name,
    String email,
    boolean email_verified,
    String adminKey,
    String sub,
    String picture
)
```

### 🔎 Validations

Same as `UserGoogleSignUp`, with extra:

* `adminKey`: must not be blank

---

## 🧾 LogInClientResponse

### ✅ Purpose

Response object sent to the **client** after login (local or Google).

```java
record LogInClientResponse(
    String name,
    String email,
    List<String> roles,
    String cookie,
    String jwt
)
```

### 🔎 Validations

* All fields are required
* `roles` must be non-empty

---

## 🗝️ AdminGoogleLogIn

### ✅ Purpose

Admin login using Google (only requires email + adminKey).

```java
record AdminGoogleLogIn(
    String adminKey,
    String email
)
```

### 🔎 Validations

* Both fields required
* `email` must match pattern

---

## 🧾 adminCreatedRequestBodyDto

### ✅ Purpose

Used when creating a new admin user.

```java
record adminCreatedRequestBodyDto(
    String email
)
```

* `email`: required

🧪 No regex validation (should be added for safety)

---

## 🌐 AuthCodeRequest

### ✅ Purpose

Used when exchanging an **OAuth code** for a token.

```java
record AuthCodeRequest(
    String code,
    String redirectUri
)
```

🧪 No validation logic (assumes OAuth provider checks validity)

---

## 🪙 GoogleTokenResponse

### ✅ Purpose

Model representing response from Google token endpoint.

```java
record GoogleTokenResponse(
    String access_token,
    int expires_in,
    String refresh_token,
    String scope,
    String token_type,
    String id_token
)
```

🧪 Used for parsing Google's response — not validated internally.

---

## 👤 GoogleUser

### ✅ Purpose

Model representing a Google user fetched after token exchange.

```java
record GoogleUser(
    String sub,
    String name,
    String given_name,
    String family_name,
    String picture,
    String email,
    boolean email_verified,
    String locale
)
```

🧪 Used after successful token parsing — consumed by signup/login logic.

---

## 🧼 Validation Summary

All DTOs with user input follow strict validation logic inside the constructor:

| Record                       | Validated | Comments                       |
| ---------------------------- | --------- | ------------------------------ |
| `UserLocalSignUp`            | ✅         | Name, Email, Password required |
| `AdminLocalSignUp`           | ✅         | Adds `adminKey`                |
| `LocalLogin`                 | ✅         | Basic login check              |
| `AdminLocalLogin`            | ✅         | Checks `adminKey`              |
| `UserGoogleSignUp`           | ✅         | Email must be verified         |
| `AdminGoogleSignUp`          | ✅         | Adds `adminKey` again          |
| `LogInClientResponse`        | ✅         | Throws on missing jwt/cookie   |
| `LoginServiceResponse`       | ❌         | Internal only                  |
| `GoogleTokenResponse`        | ❌         | Passive parsing                |
| `GoogleUser`                 | ❌         | Passive parsing                |
| `AuthCodeRequest`            | ❌         | Used as request to OAuth       |
| `adminCreatedRequestBodyDto` | ✅         | Email required only            |

---


## 📂 Location

All records are located in:

```
src/main/java/com/example/AuthService/Utils/UtilRecords.java
```

---

