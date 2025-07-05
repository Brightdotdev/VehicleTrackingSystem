

# 📦 `UserService` – Handles User Logic in AuthService

This service handles all business logic related to local users and OAuth (e.g., Google) users. It performs user creation, validation, login verification, and user lookups from the database.

---

## 🧩 Dependencies

* `UserRepository`: Handles persistence (e.g., `findByEmail`, `save`)
* `UserModel`: Represents a user in your system
* Custom Exceptions:

  * `NotFoundException`
  * `ConflictException`

---

## 🧪 Methods

### 🔍 `UserModel findByEmail(String email)`

Fetches a user by their email.

* **Throws**: `NotFoundException` if user does not exist.
* **Usage**: Used across services to fetch a user for authentication.

---

### 💾 `UserModel save(UserModel user)`

Persists a user in the database.

* **Returns**: The saved user (with ID and timestamps).

---

### ✅ `boolean existsByEmail(String email)`

Checks if a user exists using their email address.

* **Returns**: `true` if the user exists, `false` otherwise.

---

### 📜 `List<UserModel> findAll()`

Returns a list of all users in the database.

* **Usage**: Used in admin dashboards or debugging.

---

### 🔁 `UserModel findOrCreateFromOAuth(...)`

Handles OAuth sign-up or login logic:

* If the user already exists → returns the existing user.
* If not → creates a new user with:

  * `ROLE_USER`
  * `ROLE_GOOGLE`
  * Sets name, email, profile image, email verification status.

#### Parameters:

| Name             | Type    | Description                         |
| ---------------- | ------- | ----------------------------------- |
| `email`          | String  | User email                          |
| `name`           | String  | User display name                   |
| `imageUrl`       | String  | Profile picture from Google         |
| `provider`       | String  | e.g. `"GOOGLE_USER_1234"`           |
| `email_verified` | boolean | Whether Google verified their email |

---

### 🔐 `UserModel logInFromAuth(String email)`

Validates that a user is a **Google-authenticated user**.

* **Throws**:

  * `NotFoundException` if no user
  * `ConflictException` if user is not a Google user

---

### 🔐 `UserModel localLogIn(String email)`

Validates that a user is a **locally-authenticated user**.

* **Throws**:

  * `NotFoundException` if no user
  * `ConflictException` if user doesn't have `ROLE_USER`

---

## 💥 Exceptions Handled

| Exception           | When It Occurs                          |
| ------------------- | --------------------------------------- |
| `NotFoundException` | Email not found in database             |
| `ConflictException` | User exists but doesn't match auth type |

---

## 🧠 Example Use Cases

* Local signup → check `existsByEmail` → `save`
* Google login → `findOrCreateFromOAuth`
* Validating cookie token user → `findByEmail` or `localLogIn`

---

