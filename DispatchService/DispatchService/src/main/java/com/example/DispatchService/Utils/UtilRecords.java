package com.example.DispatchService.Utils;



import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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




    public record DispatchCompletedEvent(

            @NotBlank(message = "VIN is required")
            String vehicleIdentificationNumber,
            @NotBlank(message = "Name is required")
            String userName,
            Long dispatchId,
            LocalDateTime endTime
    ) {}





public record dispatchRequestBody(

    @NotNull(message = "Uhm what type of vehicle is being dispatched")
    String vehicleIdentificationNumber,

    @NotNull(message = "Uhm what type of vehicle class is being dispatched")
    @Enumerated(EnumType.STRING)
    DispatchEnums.VehicleStatus vehicleClass,

    @NotNull(message = "Uhm what type of vehicle is being dispatched")
    @Enumerated(EnumType.STRING)
    DispatchEnums.DispatchReason dispatchReason,


    String dispatchRequester,

    @NotNull(message = "When do you plan to end the dispatch boy")
    LocalDateTime dispatchEndTime

){}



    public record DispatchResponseDTO(
            List<Map<String , Boolean>> wildCards,
            double safetyScore,
            List<Map<String, Double>> healthAttributes,
            boolean canDispatch
    ) {}

}
