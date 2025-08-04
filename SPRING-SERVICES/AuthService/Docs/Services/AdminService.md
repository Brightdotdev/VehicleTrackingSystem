

# 👑 `AdminService` – Handles Admin-Specific Logic in AuthService

This service manages admin accounts, handling signup/login authorization, validation using a predefined `adminKey`, and Google/local authentication flow.

---

## 🧩 Dependencies

* `UserRepository`: User persistence
* `RabbitMqSenderService`: (Optional) used for syncing admin creation across services
* `UserModel`: User entity
* `UtilRecords`: Contains request/response DTOs and utility records

---

## 🔐 Admin Key

* The hardcoded admin key is `223344`
* Used to authorize admin-level actions (sign-up, login, etc.)

---

## 🧪 Methods

### 🔍 `UserModel findAdmin(String email)`

Finds an admin user by email.

* **Throws**:

    * `NotFoundException` if user not found
    * `AccessException` if user exists but is **not an admin**

---

### ✅ `boolean adminExistsByEmail(String email)`

Checks if a valid admin with the email exists.

* If a non-admin exists with the email → throws `ConflictException`

---

### 📜 `List<UserModel> findAll()`

Returns a list of all users who have the `ROLE_ADMIN`.

---

### 🔐 `UserModel logInFromOauth(AdminGoogleLogIn adminReq)`

Validates admin key and ensures the user is a `ROLE_GOOGLE` admin.

* **Throws**:

    * `AccessException` for invalid key
    * `ConflictException` for invalid Google role

---

### 🔐 `UserModel localAdminLogin(AdminLocalLogin adminReq)`

Validates the admin key and returns the admin if valid.

* **Throws**:

    * `AccessException` for bad key
    * `NotFoundException` / `AccessException` from `findAdmin`

---

### ⚙️ `Boolean isValidAdminRequest(AdminLocalSignUp request)`

Performs validation for local admin signup:

* Validates the admin key
* Checks for duplicate email
* Throws exceptions on failure

---

### ⚙️ `Boolean isValidAdminRequestOauth(AdminGoogleSignUp request)`

Same as above, but for Google-based admin signup.

---

### 🚀 `UserModel handleOath2AdminSignUp(AdminGoogleSignUp request)`

Creates a new admin with:

* `ROLE_ADMIN`, `ROLE_USER`, `ROLE_GOOGLE`

* Google credentials and metadata

* Uses `isValidAdminRequestOauth(...)` before creation.

* Optional: sends message to other microservices via RabbitMQ *(currently commented out)*

---

### 🔑 `Integer getAdminKey()`

Returns the static key `223344`.

> **Note**: Replace this hardcoded key with a `.env` or Spring Config value in production.

---

## 💥 Exceptions Handled

| Exception           | Reason                           |
| ------------------- | -------------------------------- |
| `AccessException`   | Invalid key or non-admin access  |
| `ConflictException` | Duplicate email or role mismatch |
| `NotFoundException` | Admin user not found             |

---

## 🧠 Example Use Cases

| Action               | Method                                 |
| -------------------- | -------------------------------------- |
| Admin Google Sign-Up | `handleOath2AdminSignUp`               |
| Admin Local Login    | `localAdminLogin`                      |
| Validate Admin Key   | `getAdminKey` or `isValidAdminRequest` |
| Get All Admins       | `findAll`                              |


