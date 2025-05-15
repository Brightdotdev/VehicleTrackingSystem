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

    public record DispatchCompletedEvent(

            @NotBlank(message = "VIN is required")
            String vehicleIdentificationNumber,
            @NotBlank(message = "Name is required")
            String userName,
            Long dispatchId,
            LocalDateTime endTime
    ) {}

    public record checkPoint(
            @NotNull(message = "Where was the checkpoint set")
            String location,
            @NotNull(message = "When was the checkpoint check pointed")
            LocalDateTime timeStamp
            ){}


    public record TrackingModelDTO(
            @NotNull(message = "What vehicle are we tracking")
            String vehicleIdentificationNumber,

            @NotNull(message = "Who is requesting the vehicle")
            String dispatchRequester,

            @NotNull(message = "Which dispatch are we tracking")
            Long dispatchId,

            @NotNull(message = "Who validated the dispatch")
            String dispatchedBy,

            String dispatchReason,

            List<Map<String, String>> checkpoints,
            Map<String, String> currentLocation,
            LogEnums.DispatchStatus dispatchStatus,
            LocalDateTime dispatchEndTime,
            LocalDateTime createdAt
            ) {
    }


    public record TrackingModel(
            @NotNull(message = "What vehicle are we tracking")
            String vehicleIdentificationNumber,

            @NotNull(message = "Who is requesting the vehicle")
            String dispatchRequester,

            @NotNull(message = "Which dispatch are we tracking")
            Long dispatchId,

            @NotNull(message = "Who validated the dispatch")
            String dispatchedBy,

            LogEnums.DispatchReason dispatchReason,

            List<UtilRecords.checkPoint> checkpoints,
            UtilRecords.checkPoint currentLocation,
            LogEnums.DispatchStatus dispatchStatus,
            LocalDateTime dispatchEndTime,
            LocalDateTime createdAt
    ){}



    public record dispatchRequestBody(

            @NotNull(message = "Uhm what type of vehicle is being dispatched")
            String vehicleIdentificationNumber,

            @NotNull(message = "Uhm what type of vehicle class is being dispatched")
            @Enumerated(EnumType.STRING)
            LogEnums.VehicleStatus vehicleClass,

            @NotNull(message = "Uhm what type of vehicle is being dispatched")
            @Enumerated(EnumType.STRING)
            LogEnums.DispatchReason dispatchReason,

            String dispatchRequester,

            @NotNull(message = "When do you plan to end the dispatch boy")
            LocalDateTime dispatchEndTime

    ){}



    public record NotificationRecord(
            String id,

            @NotNull(message = "Who are we sending the notification to")
            String receiver,

            @NotNull(message = "The Notification must have a message")
            String message,

            @NotNull(message = "The task must have a title")
            Boolean read,

            @NotNull(message = "The task must have a title")
            String description,

            LogEnums.NotificationType type,

            LocalDateTime createdAt,

            LocalDateTime readAt
    ) {
        // Default constructor with null checks
        public NotificationRecord {
            if (receiver == null) throw new NotFoundException("Who are we sending the notification to");
            if (message == null) throw new NotFoundException("The Notification must have a message");
            if (read == null) throw new NotFoundException("The task must have a title");
            if (description == null) throw new NotFoundException("The task must have a description");
        }
    }



    public record ValidatedDispatch(
            @NotBlank(message = "the dispatch id is needed")
            Long dispatchId,


            @NotNull
            String vehicleName,

            @NotNull
            LogEnums.DispatchReason dispatchReason,
            @NotBlank(message = "Vehicle identification is needed")
            String vehicleIdentificationNumber,

            @NotBlank(message = "Who requested for the dispatch?? is needed")
            String dispatchRequester,

            @NotBlank(message = "Vehicle identification is needed")
            String dispatchAdmin) {}



}
