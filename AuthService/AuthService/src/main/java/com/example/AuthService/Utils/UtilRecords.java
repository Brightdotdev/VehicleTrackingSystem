package com.example.AuthService.Utils;

import com.example.AuthService.Models.UserModel;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.regex.Pattern;

public class UtilRecords {

    // Common email‐validation regex
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    // -------------------------------
    // Response record: no validation
    // -------------------------------
    public record LoginServiceResponse(UserModel user, Authentication auth) {}


    // -------------------------------
    // Local User Signup
    // -------------------------------
    public record UserLocalSignUp(

            String name,
            String image,
            String email,
            String password
    ) {
        public UserLocalSignUp {
            // Name must not be null or blank
            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("Name is required");
            }
            // Email must not be null/blank and must match pattern
            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("Email is required for sign up");
            }
            if (!EMAIL_PATTERN.matcher(email).matches()) {
                throw new IllegalArgumentException("Email should be valid");
            }
            // Password must be at least 6 characters
            if (password == null || password.length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters");
            }

        }
    }


    // -------------------------------
    // Admin Local Signup
    // -------------------------------
    public record AdminLocalSignUp(
            String name,
            String adminKey,
            String email,
            String password
    ) {
        public AdminLocalSignUp {
            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("Name is required");
            }

            // adminKey is primitive int; you can check for a valid range if needed
            if (adminKey.isBlank()) {
                throw new IllegalArgumentException("A valid adminKey is required");
            }
            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("Email is required for sign up");
            }
            if (!EMAIL_PATTERN.matcher(email).matches()) {
                throw new IllegalArgumentException("Email should be valid");
            }
            if (password == null || password.length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters");
            }
        }
    }


    // -------------------------------
    // Client Login Response
    // -------------------------------
    public record LogInClientResponse(
            String name,
            String email,
            List<String> roles,
            String cookie
    ) {
        public LogInClientResponse {
            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("Name is required");
            }
            if (email == null || email.isBlank() || !EMAIL_PATTERN.matcher(email).matches()) {
                throw new IllegalArgumentException("A valid email is required");
            }
            if (roles == null || roles.isEmpty()) {
                throw new IllegalArgumentException("Roles list cannot be empty");
            }
            if (cookie == null || cookie.isBlank()) {
                throw new IllegalArgumentException("Cookie is required");
            }
        }
    }


    // -------------------------------
    // Google User Signup
    // -------------------------------
    public record UserGoogleSignUp(
            String name,
            String email,
            boolean email_verified,
            String sub,
            String picture
    ) {
        public UserGoogleSignUp {
            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("Name is required");
            }
            if (email == null || email.isBlank() || !EMAIL_PATTERN.matcher(email).matches()) {
                throw new IllegalArgumentException("A valid email is required");
            }
            if (!email_verified) {
                throw new IllegalArgumentException("Google email must be verified");
            }
            if (sub == null || sub.isBlank()) {
                throw new IllegalArgumentException("sub (Google user ID) is required");
            }
            if (picture == null || picture.isBlank()) {
                throw new IllegalArgumentException("picture URL is required");
            }
        }
    }


    // -------------------------------
    // Admin Google Signup
    // -------------------------------
    public record AdminGoogleSignUp(
            String name,
            String email,
            boolean email_verified,
            String adminKey,
            String sub,
            String picture
    ) {
        public AdminGoogleSignUp {
            if (name == null || name.isBlank()) {
                throw new IllegalArgumentException("Name is required");
            }
            if (email == null || email.isBlank() || !EMAIL_PATTERN.matcher(email).matches()) {
                throw new IllegalArgumentException("A valid email is required");
            }
            if (!email_verified) {
                throw new IllegalArgumentException("Google email must be verified");
            }
            if (adminKey.isBlank()) {
                throw new IllegalArgumentException("A valid adminKey is required");
            }
            if (sub == null || sub.isBlank()) {
                throw new IllegalArgumentException("sub (Google user ID) is required");
            }
            if (picture == null || picture.isBlank()) {
                throw new IllegalArgumentException("picture URL is required");
            }
        }
    }


    // -------------------------------
    // Local Login
    // -------------------------------
    public record LocalLogin(
            String email,
            String password
    ) {
        public LocalLogin {
            if (email == null || email.isBlank() || !EMAIL_PATTERN.matcher(email).matches()) {
                throw new IllegalArgumentException("A valid email is required for log in");
            }
            if (password == null || password.isBlank()) {
                throw new IllegalArgumentException("Password is required for log in");
            }
        }
    }


    // -------------------------------
    // Admin Local Login
    // -------------------------------
    public record AdminLocalLogin(
            String adminKey,
            String email,
            String password
    ) {
        public AdminLocalLogin {
            if (adminKey.isBlank()) {
                throw new IllegalArgumentException("A valid adminKey is required");
            }
            if (email == null || email.isBlank() || !EMAIL_PATTERN.matcher(email).matches()) {
                throw new IllegalArgumentException("A valid email is required for log in");
            }
            if (password == null || password.isBlank()) {
                throw new IllegalArgumentException("Password is required for log in");
            }
        }
    }


    // -------------------------------
    // Admin Google Login
    // -------------------------------
    public record AdminGoogleLogIn(
            String adminKey,
            String email
    ) {
        public AdminGoogleLogIn {
            if (adminKey.isBlank()) {
                throw new IllegalArgumentException("A valid adminKey is required");
            }
            if (email == null || email.isBlank() || !EMAIL_PATTERN.matcher(email).matches()) {
                throw new IllegalArgumentException("A valid email is required for log in");
            }
        }
    }



    // -------------------------------
    // Creatign a new admin
    // -------------------------------
    public record adminCreatedRequestBodyDto(
            String email
    ) {
        public adminCreatedRequestBodyDto {
            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("email is required");
            }
        }
    }
}
