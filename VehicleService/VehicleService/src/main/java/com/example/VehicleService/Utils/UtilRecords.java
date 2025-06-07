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

    // ------------------------------------------------
    // DTO for signalling that a dispatch ended
    // ------------------------------------------------
    public record DispatchEndedDTO(
            Boolean wasCancelled,
            LocalDateTime timeStamp,
            String vehicleIdentificationNumber,
            String receiver,
            String vehicleName,
            Long dispatchId
    ) {
        public DispatchEndedDTO {
            // wasCancelled must be provided
            if (wasCancelled == null) {
                throw new IllegalArgumentException("wasCancelled flag is required");
            }
            // timestamp must be non-null
            if (timeStamp == null) {
                throw new IllegalArgumentException("timeStamp is required");
            }
            // VIN must be non-blank
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            // receiver must be non-blank
            if (receiver == null || receiver.isBlank()) {
                throw new IllegalArgumentException("receiver is required");
            }
            // vehicleName must be non-blank
            if (vehicleName == null || vehicleName.isBlank()) {
                throw new IllegalArgumentException("vehicleName is required");
            }
            // dispatchId must be non-null
            if (dispatchId == null) {
                throw new IllegalArgumentException("dispatchId is required");
            }
        }
    }

    // -------------------------------
    // After validation of a dispatch
    // -------------------------------
    public record ValidatedDispatch(
            Long dispatchId,
            String vehicleName,
            VehicleEnums.DispatchReason dispatchReason,
            String vehicleIdentificationNumber,
            String dispatchRequester,
            String dispatchAdmin,
            LocalDateTime dispatchEndTime
    ) {
        public ValidatedDispatch {
            if (dispatchId == null) {
                throw new IllegalArgumentException("dispatchId is required");
            }
            if (vehicleName == null || vehicleName.isBlank()) {
                throw new IllegalArgumentException("vehicleName is required");
            }
            if (dispatchReason == null) {
                throw new IllegalArgumentException("dispatchReason is required");
            }
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            if (dispatchRequester == null || dispatchRequester.isBlank()) {
                throw new IllegalArgumentException("dispatchRequester is required");
            }
            if (dispatchAdmin == null || dispatchAdmin.isBlank()) {
                throw new IllegalArgumentException("dispatchAdmin is required");
            }
            if (LocalDateTime.now().isAfter(dispatchEndTime)) {
                throw new IllegalArgumentException("The date is not dating bro");
            }
        }}




    // ------------------------------------------------
    // DTO for creating or updating a vehicle
    // ------------------------------------------------
    public record VehicleDTO(
            String model,
            VehicleEnums.EngineType engineType,
            VehicleEnums.VehicleType vehicleType,
            VehicleEnums.VehicleStatus vehicleStatus,
            String vehicleMetadata,
            List<String> vehicleImages

    ) {
        public VehicleDTO {
            // model must be non-blank
            if (model == null || model.isBlank()) {
                throw new IllegalArgumentException("model is required");
            }
            // engineType enum must be non-null
            if (engineType == null) {
                throw new IllegalArgumentException("engineType is required");
            }
            // vehicleType enum must be non-null
            if (vehicleType == null) {
                throw new IllegalArgumentException("vehicleType is required");
            }
            // vehicleStatus enum must be non-null
            if (vehicleStatus == null) {
                throw new IllegalArgumentException("vehicleStatus is required");
            }
            // vehicleImages list must be non-null (can be empty)
            if (vehicleImages == null) {
                throw new IllegalArgumentException("vehicleImages list is required");
            }
            // vehicleMetadata may be optional; no check here
        }
    }


    // ------------------------------------------------
    // DTO returned by external vehicle API
    // ------------------------------------------------
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
    ) {
        public VehicleApiData {
            // VIN must be non-blank
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            // licensePlate must be non-blank
            if (licensePlate == null || licensePlate.isBlank()) {
                throw new IllegalArgumentException("licensePlate is required");
            }
            // model must be non-blank
            if (model == null || model.isBlank()) {
                throw new IllegalArgumentException("model is required");
            }
            // all enums must be non-null
            if (engineType == null) {
                throw new IllegalArgumentException("engineType is required");
            }
            if (vehicleType == null) {
                throw new IllegalArgumentException("vehicleType is required");
            }
            if (vehicleStatus == null) {
                throw new IllegalArgumentException("vehicleStatus is required");
            }
            if (dispatchStatus == null) {
                throw new IllegalArgumentException("dispatchStatus is required");
            }
            // lists must be non-null
            if (dispatchHistory == null) {
                throw new IllegalArgumentException("dispatchHistory list is required");
            }
            if (vehicleImages == null) {
                throw new IllegalArgumentException("vehicleImages list is required");
            }
            if (healthAttributes == null) {
                throw new IllegalArgumentException("healthAttributes list is required");
            }
            // safetyScore is primitive; if you need a range check, add here
        }
    }


    // ------------------------------------------------
    // DTO for dispatch request bodies
    // ------------------------------------------------
    public record dispatchRequestBodyDTO(
            String vehicleName,
            String vehicleIdentificationNumber,
            @Enumerated(EnumType.STRING)
            VehicleEnums.VehicleStatus vehicleStatus,
            @Enumerated(EnumType.STRING)
            VehicleEnums.DispatchReason dispatchReason,
            String dispatchRequester,
            LocalDateTime dispatchEndTime
    ) {
        public dispatchRequestBodyDTO {
            // vehicleName must be non-blank
            if (vehicleName == null || vehicleName.isBlank()) {
                throw new IllegalArgumentException("vehicleName is required");
            }
            // VIN must be non-blank
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            // enums must be non-null
            if (vehicleStatus == null) {
                throw new IllegalArgumentException("vehicleStatus is required");
            }
            if (dispatchReason == null) {
                throw new IllegalArgumentException("dispatchReason is required");
            }
            // dispatchRequester may be optional
            // dispatchEndTime must be non-null
            if (dispatchEndTime == null) {
                throw new IllegalArgumentException("dispatchEndTime is required");
            }
        }
    }


    // -------------------------------
    // Start dispatch tracking
    // -------------------------------
    public record StartTrackingDTO(
            Long dispatchId,
            String vehicleName,
            VehicleEnums.DispatchReason dispatchReason,
            String vehicleIdentificationNumber,
            String dispatchRequester,
            String dispatchAdmin
    ) {
        public StartTrackingDTO {
            if (dispatchId == null) {
                throw new IllegalArgumentException("dispatchId is required");
            }
            if (vehicleName == null || vehicleName.isBlank()) {
                throw new IllegalArgumentException("vehicleName is required");
            }
            if (dispatchReason == null) {
                throw new IllegalArgumentException("dispatchReason is required");
            }
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            if (dispatchRequester == null || dispatchRequester.isBlank()) {
                throw new IllegalArgumentException("dispatchRequester is required");
            }
            if (dispatchAdmin == null || dispatchAdmin.isBlank()) {
                throw new IllegalArgumentException("dispatchAdmin is required");
            }


        }}
}
