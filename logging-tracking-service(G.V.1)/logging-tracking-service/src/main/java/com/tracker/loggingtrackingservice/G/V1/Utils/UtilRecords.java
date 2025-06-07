package com.tracker.loggingtrackingservice.G.V1.Utils;

import com.tracker.loggingtrackingservice.G.V1.Exceptions.NotFoundException;
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
    // DTO for signalling that a dispatch ended
    // -------------------------------
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
            // timestamp must be provided
            if (timeStamp == null) {
                throw new IllegalArgumentException("Timestamp is required");
            }
            // VIN, receiver, vehicleName must be non-null, non-blank
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("VIN is required");
            }
            if (receiver == null || receiver.isBlank()) {
                throw new IllegalArgumentException("Receiver is required");
            }
            if (vehicleName == null || vehicleName.isBlank()) {
                throw new IllegalArgumentException("Vehicle name is required");
            }
            // dispatchId must be provided
            if (dispatchId == null) {
                throw new IllegalArgumentException("dispatchId is required");
            }
        }
    }


    // -------------------------------
    // Event published when a dispatch completes
    // -------------------------------
    public record DispatchCompletedEvent(
            String vehicleIdentificationNumber,
            String userName,
            Long dispatchId,
            LocalDateTime endTime
    ) {
        public DispatchCompletedEvent {
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("VIN is required");
            }
            if (userName == null || userName.isBlank()) {
                throw new IllegalArgumentException("User name is required");
            }
            if (dispatchId == null) {
                throw new IllegalArgumentException("dispatchId is required");
            }
            if (endTime == null) {
                throw new IllegalArgumentException("endTime is required");
            }
        }
    }


    // -------------------------------
    // A single geographic/time checkpoint
    // -------------------------------
    public record CheckPoint(
            String latitude,
            String longitude,
            LocalDateTime timeStamp
    ) {
        public CheckPoint {
            if (latitude == null || latitude.isBlank()) {
                throw new IllegalArgumentException("Latitude is required");
            }
            if (longitude == null || longitude.isBlank()) {
                throw new IllegalArgumentException("Longitude is required");
            }
            if (timeStamp == null) {
                throw new IllegalArgumentException("timeStamp is required");
            }
        }
    }


    // -------------------------------
    // DTO for exposing tracking data to clients
    // -------------------------------
    public record TrackingModelDTO(
            String vehicleIdentificationNumber,
            String dispatchRequester,
            Long dispatchId,
            String dispatchedBy,
            String dispatchReason,
            List<Map<String, String>> checkpoints,
            Map<String, String> currentLocation,
            LogEnums.DispatchStatus dispatchStatus,
            LocalDateTime dispatchEndTime,
            LocalDateTime createdAt
    ) {
        public TrackingModelDTO {
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            if (dispatchRequester == null || dispatchRequester.isBlank()) {
                throw new IllegalArgumentException("dispatchRequester is required");
            }
            if (dispatchId == null) {
                throw new IllegalArgumentException("dispatchId is required");
            }
            if (dispatchedBy == null || dispatchedBy.isBlank()) {
                throw new IllegalArgumentException("dispatchedBy is required");
            }
            if (dispatchReason == null || dispatchReason.isBlank()) {
                throw new IllegalArgumentException("dispatchReason is required");
            }
            if (checkpoints == null) {
                throw new IllegalArgumentException("checkpoints list is required");
            }
            if (currentLocation == null) {
                throw new IllegalArgumentException("currentLocation is required");
            }
            if (dispatchStatus == null) {
                throw new IllegalArgumentException("dispatchStatus is required");
            }
            if (dispatchEndTime == null) {
                throw new IllegalArgumentException("dispatchEndTime is required");
            }
            if (createdAt == null) {
                throw new IllegalArgumentException("createdAt is required");
            }
        }
    }


    // -------------------------------
    // Internal model for tracking
    // -------------------------------
    public record TrackingModel(
            String vehicleIdentificationNumber,
            String dispatchRequester,
            Long dispatchId,
            String dispatchedBy,
            LogEnums.DispatchReason dispatchReason,
            List<UtilRecords.CheckPoint> checkpoints,
            UtilRecords.CheckPoint currentLocation,
            LogEnums.DispatchStatus dispatchStatus,
            LocalDateTime dispatchEndTime,
            LocalDateTime createdAt
    ) {
        public TrackingModel {
            if (vehicleIdentificationNumber == null || vehicleIdentificationNumber.isBlank()) {
                throw new IllegalArgumentException("vehicleIdentificationNumber is required");
            }
            if (dispatchRequester == null || dispatchRequester.isBlank()) {
                throw new IllegalArgumentException("dispatchRequester is required");
            }
            if (dispatchId == null) {
                throw new IllegalArgumentException("dispatchId is required");
            }
            if (dispatchedBy == null || dispatchedBy.isBlank()) {
                throw new IllegalArgumentException("dispatchedBy is required");
            }
            if (dispatchReason == null) {
                throw new IllegalArgumentException("dispatchReason is required");
            }
            if (checkpoints == null) {
                throw new IllegalArgumentException("checkpoints list is required");
            }
            if (currentLocation == null) {
                throw new IllegalArgumentException("currentLocation is required");
            }
            if (dispatchStatus == null) {
                throw new IllegalArgumentException("dispatchStatus is required");
            }
            if (dispatchEndTime == null) {
                throw new IllegalArgumentException("dispatchEndTime is required");
            }
            if (createdAt == null) {
                throw new IllegalArgumentException("createdAt is required");
            }
        }
    }



    // ------------------------------------------------
    // DTO for dispatch request bodies
    // ------------------------------------------------
    public record dispatchRequestBodyDTO(
            String vehicleName,
            String vehicleIdentificationNumber,
            @Enumerated(EnumType.STRING)
            LogEnums.VehicleStatus vehicleStatus,
            @Enumerated(EnumType.STRING)
            LogEnums.DispatchReason dispatchReason,
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
    // Notification structure
    // -------------------------------
    public record NotificationRecord(
            String id,
            String receiver,
            String message,
            Boolean read,
            String description,
            LogEnums.NotificationType type,
            LocalDateTime createdAt,
            LocalDateTime readAt
    ) {
        public NotificationRecord {
            // Using NotFoundException here per your original
            if (receiver == null || receiver.isBlank()) {
                throw new NotFoundException("Receiver is required");
            }
            if (message == null || message.isBlank()) {
                throw new NotFoundException("Message is required");
            }
            if (read == null) {
                throw new NotFoundException("Read flag is required");
            }
            if (description == null || description.isBlank()) {
                throw new NotFoundException("Description is required");
            }
            // type, createdAt, readAt can be null if that's acceptable
        }
    }


    // -------------------------------
    // After validation of a dispatch
    // -------------------------------
    public record ValidatedDispatch(
            Long dispatchId,
            String vehicleName,
            LogEnums.DispatchReason dispatchReason,
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



    // -------------------------------
    // Start dispatch tracking
    // -------------------------------
    public record StartTrackingDTO(
            Long dispatchId,
            String vehicleName,
            LogEnums.DispatchReason dispatchReason,
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
    // -------------------------------
    // Start dispatch tracking
    // -------------------------------
    public record NotificationDto(
            String message,
            String title,
            String notificationId,
            Boolean isActionNotification,
            Map<String, Object>  badCta,
            Map<String, Object>  goodCta,
            String receiver,
            Boolean isRead
    ) {
        public NotificationDto {
            if (message == null || message.isBlank()) {
                throw new IllegalArgumentException("message is required");
            }
            if (isRead == null) {
                throw new IllegalArgumentException("Is it read or not");
            }
            if (title == null || title.isBlank()) {
                throw new IllegalArgumentException("title is required");
            }
            if (notificationId == null || notificationId.isBlank()) {
                throw new IllegalArgumentException("notificationId is required");
            }

        }}



    public record setReadRecord (String notifId) {}
}
