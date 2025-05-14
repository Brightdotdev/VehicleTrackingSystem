package com.example.VehicleService.Utils;



import com.example.VehicleService.Models.VehicleHealthAttributeModel;
import com.example.VehicleService.Models.VehicleWildcardAttributeModel;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UtilRecords {



    public record VehicleDTO(
            String model,
            VehicleEnums.EngineType engineType,
            VehicleEnums.VehicleType vehicleType,
            VehicleEnums.VehicleStatus vehicleStatus,

            String vehicleMetadata,

            List<String> vehicleImages
    ) {}


    public record VehicleApiData(

            String vehicleIdentificationNumber,
            String licensePlate,
            String model,
            VehicleEnums.EngineType engineType,
            VehicleEnums.VehicleType vehicleType,
            VehicleEnums.VehicleStatus vehicleStatus,
            VehicleEnums.VehicleDispatchStatus dispatchStatus,
            List<String> dispatchHistory,
            List<String> vehicleImages,
            double safetyScore,
            String vehicleMetadata,
            List<VehicleHealthAttributeModel> healthAttributes
    ) {}


    public record dispatchRequestBody(

            @NotNull(message = "Uhm what type of vehicle is being dispatched")
            String vehicleIdentificationNumber,

            @NotNull(message = "Uhm what type of vehicle class is being dispatched")
            @Enumerated(EnumType.STRING)
            VehicleEnums.VehicleStatus vehicleClass,
            String dispatchRequester,

            @NotNull(message = "Uhm what type of vehicle is being dispatched")
            @Enumerated(EnumType.STRING)
            VehicleEnums.DispatchReason dispatchReason,

            @NotNull(message = "When do you plan to end the dispatch boy")
            LocalDateTime dispatchEndTime

    ){}




    public record DispatchCompletedEvent(

            @NotBlank(message = "VIN is required")
            String vehicleIdentificationNumber,
            @NotBlank(message = "Name is required")
            String userName,
            Long dispatchId,
            LocalDateTime endTime
    ) {}

}
