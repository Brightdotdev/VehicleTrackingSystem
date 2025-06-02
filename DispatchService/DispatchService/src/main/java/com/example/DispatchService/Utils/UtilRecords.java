package com.example.DispatchService.Utils;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class UtilRecords {


    // -------------------------------
    // After validation of a dispatch
    // -------------------------------
    public record ValidatedDispatch(
            Long dispatchId,
            String vehicleName,
            DispatchEnums.DispatchReason dispatchReason,
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



    // ---------------------------------------------
    // Event published when a dispatch completes
    // ---------------------------------------------
    public record DispatchCompletedEvent(
            String vehicleIdentificationNumber,
            String userName,
            Long dispatchId,
            LocalDateTime endTime
    ) {
        public DispatchCompletedEvent {
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            if (userName == null || userName.isBlank()) {
                throw new IllegalArgumentException("userName is required");
            }
            if (dispatchId == null) {
                throw new IllegalArgumentException("dispatchId is required");
            }
            if (endTime == null) {
                throw new IllegalArgumentException("endTime is required");
            }
        }
    }


    // ---------------------------------------------
    // DTO for signalling that a dispatch ended
    // ---------------------------------------------
    public record DispatchEndedDTO(
            Boolean wasCancelled,
            LocalDateTime timeStamp,
            String vehicleIdentificationNumber,
            String receiver,
            String vehicleName,
            Long dispatchId
    ) {
        public DispatchEndedDTO {
            if (wasCancelled == null) {
                throw new IllegalArgumentException("wasCancelled flag is required");
            }
            if (timeStamp == null) {
                throw new IllegalArgumentException("timeStamp is required");
            }
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            if (receiver == null || receiver.isBlank()) {
                throw new IllegalArgumentException("receiver is required");
            }
            if (vehicleName == null || vehicleName.isBlank()) {
                throw new IllegalArgumentException("vehicleName is required");
            }
            if (dispatchId == null) {
                throw new IllegalArgumentException("dispatchId is required");
            }
        }
    }

    // ---------------------------------------------
    // Body for creating a new dispatch
    // ---------------------------------------------
    public record dispatchRequestBody(
            String vehicleName,
            String vehicleIdentificationNumber,
            @Enumerated(EnumType.STRING)
            DispatchEnums.VehicleStatus vehicleClass,
            @Enumerated(EnumType.STRING)
            DispatchEnums.DispatchReason dispatchReason,
            String dispatchRequester,
            LocalDateTime dispatchEndTime
    ) {
        public dispatchRequestBody {
            if (vehicleName == null || vehicleName.isBlank()) {
                throw new IllegalArgumentException("vehicleName is required");
            }
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            if (vehicleClass == null) {
                throw new IllegalArgumentException("vehicleClass is required");
            }
            if (dispatchReason == null) {
                throw new IllegalArgumentException("dispatchReason is required");
            }
            // dispatchRequester may be optional; only enforce non-null if needed
            if (dispatchEndTime == null) {
                throw new IllegalArgumentException("dispatchEndTime is required");
            }
        }
    }

    // ---------------------------------------------
    // Alternate DTO for dispatch request (identical fields)
    // ---------------------------------------------
    public record dispatchRequestBodyDTO(
            String vehicleName,
            String vehicleIdentificationNumber,
            @Enumerated(EnumType.STRING)
            DispatchEnums.VehicleStatus vehicleClass,
            @Enumerated(EnumType.STRING)
            DispatchEnums.DispatchReason dispatchReason,
            String dispatchRequester,
            LocalDateTime dispatchEndTime
    ) {
        public dispatchRequestBodyDTO {
            if (vehicleName == null || vehicleName.isBlank()) {
                throw new IllegalArgumentException("vehicleName is required");
            }
            if (dispatchRequester == null || dispatchRequester.isBlank()) {
                throw new IllegalArgumentException("Who is requesting the dispatch");
            }
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            if (vehicleClass == null) {
                throw new IllegalArgumentException("vehicleClass is required");
            }
            if (dispatchReason == null) {
                throw new IllegalArgumentException("dispatchReason is required");
            }
            if (dispatchEndTime == null) {
                throw new IllegalArgumentException("dispatchEndTime is required");
            }
        }
    }

    // ---------------------------------------------
    // Response for a dispatch, including metrics
    // ---------------------------------------------
    public record DispatchResponseDTO(
            List<Map<String, Boolean>> wildCards,
            double safetyScore,
            List<Map<String, Double>> healthAttributes,
            boolean canDispatch
    ) {
        public DispatchResponseDTO {
            if (wildCards == null) {
                throw new IllegalArgumentException("wildCards list is required");
            }
            // safetyScore is primitive double; you can enforce a range if desired:
            if (safetyScore < 0.0 || safetyScore > 100.0) {
                throw new IllegalArgumentException("safetyScore must be between 0.0 and 100.0");
            }
            if (healthAttributes == null) {
                throw new IllegalArgumentException("healthAttributes list is required");
            }
            // canDispatch is primitive boolean; always present
        }
    }


    // -------------------------------
    // Start dispatch tracking
    // -------------------------------
    public record StartTrackingDTO(
            Long dispatchId,
            String vehicleName,
            DispatchEnums.DispatchReason dispatchReason,
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
