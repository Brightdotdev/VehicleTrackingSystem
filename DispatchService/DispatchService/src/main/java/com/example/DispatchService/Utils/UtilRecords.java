package com.example.DispatchService.Utils;



import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import org.springframework.security.core.Authentication;
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




public record dispatchRequestBody(

    @NotNull(message = "Uhm what type of vehicle is being dispatched")
    String dispatchVehicleId,

    @NotNull(message = "Uhm what type of vehicle class is being dispatched")
    @Enumerated(EnumType.STRING)
    DispatchEnums.VehicleStatus vehicleClass,


    @NotNull(message = "Uhm what type of vehicle is being dispatched")
    @Enumerated(EnumType.STRING)
    DispatchEnums.DispatchReason dispatchReason

){}

    public record LocalLogin(

            @NotBlank(message = "Email is required for log in")
            @Email(message = "Email should be valid")
            String email,

            @NotBlank(message = "Password is required fol log in")
            String password) {
    }
}
