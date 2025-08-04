

# 👤 UserAuthController — `/v1/auth/user`

This controller handles all user-facing authentication endpoints:
- Local signup/login
- Google OAuth signup/login
- JWT cookie validation
- Logout

---

## 🔧 Dependencies

Injected via constructor or `@Autowired`:

- `JwtConfig` — Utility for generating and validating JWTs
- `CookieGenerationHandler` — Builds secure `Set-Cookie` headers
- `UserDetailService` — Core authentication business logic

---

## 📮 Endpoints

---

### 🔐 `POST /v1/auth/user/new-user/join-us`

Registers a new user via **email and password**.

#### ✅ Request Body

```json
{
  "name": "John Doe",
  "image": "https://...",
  "email": "john@example.com",
  "password": "123456"
}
````

#### 🧠 Process

* Calls `handleUserSignUp(...)` to create and authenticate user.
* Generates JWT and creates a `userDeskToken` cookie.
* Responds with user info and token.

#### 🔁 Response

```json
{
  "code": 201,
  "message": "User retrieved successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["ROLE_USER"],
    "cookie": "...",
    "jwt": "..."
  }
}
```

---

### 🌐 `POST /v1/auth/sign-in/user/google`

Signs up user with **Google OAuth profile data**.

#### ✅ Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "email_verified": true,
  "sub": "google_id",
  "picture": "https://..."
}
```

#### 🧠 Process

* Passes user data to `handleOath2UserSignIn(...)`.
* JWT is issued using image & name.
* Cookie is attached.

#### 🔁 Response

Same structure as `/new-user/join-us`

---

### 🔑 `POST /v1/auth/user/welcome-back/google`

Logs in a returning Google user with a saved session ID.

#### ✅ Request Body

Raw JSON string: the Google user `sub` (Google user ID)

```json
"102922222999901"
```

#### 🧠 Process

* Verifies sub exists in database.
* Generates JWT, returns cookie.

---

### 🔑 `POST /v1/auth/user/welcome-back`

Logs in a user using **local credentials**.

#### ✅ Request Body

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

#### 🧠 Process

* Authenticates user with `UserDetailService`
* Issues JWT + cookie if successful

---

### 🚪 `GET /v1/auth/user/log-out`

Logs user out by **clearing the `userDeskToken` cookie**.

#### 🔁 Response

```http
204 No Content
```

---

### 🧪 `GET /v1/auth/user/validate-cookie`

Validates `userDeskToken` cookie and extracts user info.

#### ✅ Headers

```http
Cookie: userDeskToken=your.jwt.token
```

#### 🧠 Process

* Extracts cookie from request
* Verifies JWT signature and expiration
* Returns user info + token validity

#### 🔁 Response

```json
{
  "code": 201,
  "message": "User retrieved successfully",
  "data": {
    "valid": true,
    "user": {
      "email": "john@example.com",
      "username": "John",
      "roles": ["ROLE_USER"]
    }
  }
}
```

---

## ⚙️ Helper Logic Breakdown

### 🥠 Cookie Management

All login/signup responses set a `Set-Cookie` header with:

* HttpOnly
* Secure
* SameSite=None
* Path=/
* JWT value

### 🔑 Token Generation

`JwtConfig.generateToken(...)` is used with:

* `Authentication` (for claims)
* `name` (as subject)
* `picture` (optionally)

---

## 🧪 Validation Notes

* DTOs are all annotated with `@Valid` and enforce email, password, role checks.
* Exceptions like `AccessException` are thrown when validation or JWT fails.

---

## 📦 Package

```
com.example.AuthService.Controllers.UserAuthController
```

---

