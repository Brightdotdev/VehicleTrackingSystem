package com.example.AuthService.Utils;

import com.example.AuthService.Exceptions.AccessException;
import com.example.AuthService.Exceptions.ConflictException;
import org.apache.commons.validator.routines.EmailValidator;

public class AdminServiceUtils {

    private static final EmailValidator emailValidator = EmailValidator.getInstance();

    /**
     * Validate email format
     */
    public static void validateEmailFormat(String email) {
        if (email == null || email.isEmpty() || !emailValidator.isValid(email)) {
            throw new ConflictException("Invalid email format");
        }
    }

    /**
     * Validate password strength (simple example: length >= 8)
     */
    public static void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            throw new ConflictException("Password must be at least 8 characters long");
        }
    }

    /**
     * Validate admin key matches expected value
     */
    public static void validateAdminKey(String providedKey, Integer expectedKey) {
        if (providedKey == null || !providedKey.equals(expectedKey.toString())) {
            throw new AccessException("Invalid admin key");
        }
    }

    /**
     * Validate non-null and non-empty name
     */
    public static void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ConflictException("Name cannot be empty");
        }
    }

}
