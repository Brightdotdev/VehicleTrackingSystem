# 🛡️ AdminAuthController — `/v1/auth/admin`

This controller handles authentication and authorization for **admins** in the system:
- Admin local and Google sign up
- Admin login
- Cookie validation
- Admin key verification

---

## 🔧 Dependencies

- `CookieGenerationHandler` — Generates `adminDeskCookie`
- `UserDetailService` — Shared user/admin sign-up/login logic
- `AdminService` — Used for admin-only DB access and adminKey
- `JwtConfig` — Generates and validates JWTs for admins

---

## 📮 Endpoints

---

### 👤 `POST /v1/auth/admin/new-user/join-us`

Registers a new **admin** using email/password and a valid `adminKey`.

#### ✅ Request Body

```json
{
  "name": "Jane Admin",
  "adminKey": "secret-key",
  "email": "admin@example.com",
  "password": "123456"
}
````

#### 🔁 Response

```json
{
  "code": 201,
  "message": "User retrieved successfully",
  "data": {
    "name": "Jane Admin",
    "email": "admin@example.com",
    "roles": ["ROLE_ADMIN"],
    "cookie": "...",
    "jwt": "..."
  }
}
```

---

### 🧑‍💻 `POST /v1/auth/admin/new-user/google`

Signs up a new admin using **Google OAuth** credentials.

#### ✅ Request Body

```json
{
  "name": "Jane Admin",
  "email": "admin@example.com",
  "email_verified": true,
  "adminKey": "secret-key",
  "sub": "google_id",
  "picture": "https://..."
}
```

#### 🧠 Notes

* Admin key must match server's key.
* Fails if email is not verified by Google.

---

### 🔑 `POST /v1/auth/admin/welcome-back`

Admin login with local credentials.

#### ✅ Request Body

```json
{
  "adminKey": "secret-key",
  "email": "admin@example.com",
  "password": "123456"
}
```

---

### 🌐 `POST /v1/auth/admin/welcome-back/google`

Admin login via Google by submitting email + adminKey.

#### ✅ Request Body

```json
{
  "adminKey": "secret-key",
  "email": "admin@example.com"
}
```

---

### 🚪 `GET /v1/auth/admin/log-out`

Logs out the admin by clearing the `adminDeskCookie`.

#### 🔁 Response

```http
204 No Content
```

---

### 🧪 `GET /v1/auth/admin/validate-cookie`

Validates the JWT token from the `adminDeskCookie`.

#### ✅ Request

Header:

```
Cookie: adminDeskCookie=jwt-token
```

#### 🔁 Response

```json
{
  "code": 200,
  "message": "User retrieved successfully",
  "data": {
    "valid": true,
    "user": {
      "email": "admin@example.com",
      "username": "Jane Admin",
      "roles": ["ROLE_ADMIN"],
      "picture": "https://..."
    }
  }
}
```

---

### 🔐 `POST /v1/auth/admin/validate-key`

Checks whether the provided `adminKey` matches the current valid server key.

#### ✅ Request

```json
{
  "adminKey": "secret-key"
}
```

#### 🔁 Responses

* ✅ **200 OK** if valid
* ❌ **403 Forbidden** if invalid

---

## ⚙️ Notes

* All JWTs are created with the admin's name and image.
* Tokens are wrapped in `adminDeskCookie` with:

    * `Secure`, `HttpOnly`, `SameSite=None`, etc.
* Reuses DTOs from `UtilRecords` for input validation and standardization.

---

## 📦 Package

```
com.example.AuthService.Controllers.AdminController
```

---

