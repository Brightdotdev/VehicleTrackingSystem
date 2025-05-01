package com.example.VehicleService.Utils;



import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtilRecords {







    public record UserLocalSignUp(
            @NotBlank(message = "Name is required")
            String name,

            @NotBlank(message = "Email is required for sign up")
            @Email(message = "Email should be valid")
            String email,


            List<String> roles,

            @NotBlank(message = "Password is required for sign up")
            @Size(min = 6, message = "Password must be at least 6 characters")
            String password
    ) {}



    public record LogInClientResponse(

            @NotBlank(message = "Name is required")
            String name,

            @NotBlank(message = "Email is required for sign up")
            @Email(message = "Email should be valid")
            String email,


            List<String> roles,

            String cookie
    ) {}



    public record UserGoogleSignUp(
            @NotBlank(message = "Name is required")
            String name,

            @NotBlank(message = "Email is required for sign up")
            @Email(message = "Email should be valid")
            String email,


            @AssertTrue
            boolean email_verified,


            String sub,
            String picture
    ) {}

    public record  SafetyScoreResult(double safetyScore, List<String> wildCardReasons  ) {}
}
