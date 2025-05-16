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









    public record DispatchEndedDTO(

            Boolean wasCancelled,
            @NotBlank(message = "Timestamp is required")
            LocalDateTime timeStamp,
            @NotBlank(message = "VIN is required")
            String vehicleIdentificationNumber,

            @NotBlank(message = "VIN is required")
            String receiver,

            @NotBlank(message = "VIN is required")
            String vehicleName,
            Long dispatchId) {}





    public record ValidatedDispatch(
            @NotBlank(message = "the dispatch id is needed")
            Long dispatchId,


            @NotNull
            String vehicleName,

            @NotNull
            VehicleEnums.DispatchReason dispatchReason,
            @NotBlank(message = "Vehicle identification is needed")
            String vehicleIdentificationNumber,

            @NotBlank(message = "Who requested for the dispatch?? is needed")
            String dispatchRequester,

            @NotBlank(message = "Vehicle identification is needed")
            String dispatchAdmin) {}



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
            List<Long> dispatchHistory,
            List<String> vehicleImages,
            double safetyScore,
            String vehicleMetadata,
            List<VehicleHealthAttributeModel> healthAttributes
    ) {}

    public record dispatchRequestBodyDTO(

            @NotNull
            String vehicleName,
            @NotNull(message = "Uhm what type of vehicle is being dispatched")
            String vehicleIdentificationNumber,

            @NotNull(message = "Uhm what type of vehicle class is being dispatched")
            @Enumerated(EnumType.STRING)
            VehicleEnums.VehicleStatus vehicleClass,

            @NotNull(message = "Uhm what type of vehicle is being dispatched")
            @Enumerated(EnumType.STRING)
            VehicleEnums.DispatchReason dispatchReason,

            String dispatchRequester,

            @NotNull(message = "When do you plan to end the dispatch boy")
            LocalDateTime dispatchEndTime
    ){}



}
