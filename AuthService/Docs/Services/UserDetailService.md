
# 🧠 `UserDetailService`

This service coordinates **user signup**, **login**, **OAuth sign-in**, and **authentication token construction** for both **regular users** and **admins**.

---

## 📦 Package

```

com.example.AuthService.Services.UserDetailService

````

---

## 👷 Responsibilities

| Method                              | Purpose                                 |
|-------------------------------------|-----------------------------------------|
| `loadUserByUsername`                | Loads a user by email for auth          |
| `handleUserSignUp`                 | Registers local user                    |
| `handleUserLocalLogIn`            | Logs in local user                      |
| `handleOath2UserSignIn`           | Registers Google user                   |
| `handleUserOath2UserLogIn`        | Logs in Google user                     |
| `handleAdminLocalSignUp`          | Registers local admin                   |
| `handleAdminLogIn`                | Logs in local admin                     |
| `handleOath2AdminSignUp`          | Registers admin via Google              |
| `handleOath2AdminLogIn`           | Logs in admin via Google                |

---

## 📥 Dependencies Injected

```java
@Autowired
public UserDetailService(
    UserService userService,
    AdminService adminService,
    @Lazy AuthenticationManager authenticationManager,
    @Lazy PasswordEncoder passwordEncoder,
    RabbitMqSenderService rabbitMqSenderService
)
````

---

## 🔑 Method Breakdown

### `loadUserByUsername(String email)`

Used by Spring Security during login.

```java
public UserDetails loadUserByUsername(String email)
```

Returns a `UserModel` by email, or throws `UsernameNotFoundException`.

---

### `handleUserSignUp(UserLocalSignUp request)`

Registers a local user:

* Hashes password
* Validates uniqueness
* Saves to DB
* Authenticates
* Returns token payload

```java
UserModel user = new UserModel();
user.setPassword(passwordEncoder.encode(request.password()));
...
authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
```

---

### `handleUserLocalLogIn(LocalLogin request)`

Authenticates existing local user via Spring Security manager.

Throws:

* `NotFoundException` if user not found
* `ConflictException` if password fails

---

### `handleOath2UserSignIn(UserGoogleSignUp request)`

Creates or finds an OAuth2 Google user, generates Spring `Authentication`, and returns it.

> Uses:
>
> ```java
> userService.findOrCreateFromOAuth(...)
> ```

---

### `handleUserOath2UserLogIn(String email)`

Loads a Google user by email and creates an authentication object manually — no password needed.

---

### `handleAdminLocalSignUp(AdminLocalSignUp request)`

Registers an admin locally, verifies the `adminKey`, and authenticates.

Temporarily disabled RabbitMQ call:

```java
// rabbitMqSenderService.sendAdminCreated(adminReq);
```

> **Roles**:
>
> ```
> user.setRoles(List.of("ROLE_ADMIN"));
> ```

---

### `handleAdminLogIn(AdminLocalLogin request)`

Authenticates existing local admin via Spring Security.

---

### `handleOath2AdminSignUp(AdminGoogleSignUp request)`

Creates new admin via Google sign-up flow, returns token metadata.

---

### `handleOath2AdminLogIn(AdminGoogleLogIn request)`

Logs in existing admin using Google account and `adminKey`.

---

## 🔁 Internal Return Object

All methods return:

```java
record LoginServiceResponse(
    UserModel user,
    Authentication auth,
    String userImage
)
```

This is passed to controllers for JWT creation and response building.

---

## ⚙️ Auth Flow Summary

| Flow Type     | Logic Source       | Authenticated? | Stored? |
| ------------- | ------------------ | -------------- | ------- |
| Local Signup  | Email + Password   | ✅ Yes          | ✅ Yes   |
| Google Signup | Google email + sub | ✅ Yes          | ✅ Yes   |
| Local Login   | Valid credentials  | ✅ Yes          | —       |
| Google Login  | Valid Google email | ✅ Yes          | —       |

---

## 📄 Pseudocode Summary

```plaintext
function loadUserByUsername(email):
    return userService.findByEmail(email)

function handleUserSignUp(request):
    if userService.existsByEmail(request.email) → throw
    hash password
    save user
    authenticate user
    return LoginServiceResponse(user, auth, image)

function handleUserLocalLogIn(request):
    if not user exists → throw
    authenticate
    return LoginServiceResponse(user, auth, image)

function handleOath2UserSignIn(request):
    user = userService.findOrCreateFromOAuth(...)
    return LoginServiceResponse(user, auth, image)

function handleUserOath2UserLogIn(email):
    user = userService.logInFromAuth(email)
    return LoginServiceResponse(user, auth, image)

function handleAdminLocalSignUp(request):
    if invalid adminKey → throw
    save admin
    authenticate
    return LoginServiceResponse(admin, auth, image)

function handleAdminLogIn(request):
    authenticate
    return LoginServiceResponse(admin, auth, image)

function handleOath2AdminSignUp(request):
    create admin from Google data
    return LoginServiceResponse(admin, auth, image)

function handleOath2AdminLogIn(request):
    fetch + authenticate existing Google admin
    return LoginServiceResponse(admin, auth, image)
```

---

## 🚨 Notes

* `@Transactional` ensures DB operations and authentication logic stay atomic.
* Password hashing is done using `BCrypt` from `SecurityConfig`.
* User and admin logic are intentionally merged into this single service.

---

## 🧬 Next Steps

Docs you probably want to read next:

* [`UserService`](./UserService.md)
* [`AdminService`](./AdminService.md)
* [`RabbitMqSenderService`](../RabbitMq/RabbitMqSender.md)
---

## ✅ Summary

| Feature            | Covered In This Service? |
| ------------------ | ------------------------ |
| Local Auth         | ✅                        |
| OAuth2 Auth        | ✅                        |
| Admin Auth         | ✅                        |
| Token-ready Output | ✅                        |
| Password Hashing   | ✅                        |

```


