package com.tracker.loggingtrackingservice.G.V1.Controllers;

import com.tracker.loggingtrackingservice.G.V1.Models.TrackingModel;
import com.tracker.loggingtrackingservice.G.V1.Messaging.RabbitMq.RabbitMqReceiverService;
import com.tracker.loggingtrackingservice.G.V1.Services.UserNotificationService;
import com.tracker.loggingtrackingservice.G.V1.Services.TrackingService;
import com.tracker.loggingtrackingservice.G.V1.Utils.ApiResponse;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/v1/user/tracking")
public class TrackingController {

    private final TrackingService trackingService;
    private final UserNotificationService userNotificationService;
    private final RabbitMqReceiverService rabbitMqReceiverService;

    // Constructor injection of the TrackingService
    public TrackingController(TrackingService trackingService, UserNotificationService userNotificationService, RabbitMqReceiverService rabbitMqReceiverService) {

        this.trackingService = trackingService;
        this.userNotificationService = userNotificationService;
        this.rabbitMqReceiverService = rabbitMqReceiverService;
    }

    /**
     * Endpoint to revalidate a tracking record
     */
    @PutMapping("/revalidate/{dispatchId}")
    public ResponseEntity<ApiResponse<TrackingModel>> revalidateTracking(
            @PathVariable @NotBlank(message = "Dispatch ID cannot be blank") Long dispatchId,
            @Valid @RequestBody UtilRecords.CheckPoint checkPoint
            ) {
        TrackingModel result = trackingService.revalidateTrackingPosition(dispatchId, checkPoint);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "dispatch tracked successfully",
                        result
                ));}



    /**
     * Endpoint to start a tracking
     */
    @PutMapping("/start/{dispatchId}")
    public ResponseEntity<ApiResponse<TrackingModel>> startTracking(
            @PathVariable @NotBlank(message = "Dispatch ID cannot be blank") Long dispatchId,
            @Valid @RequestBody UtilRecords.CheckPoint checkPoint

    ) {
        TrackingModel result = trackingService.startTracking(dispatchId,checkPoint);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "The tracking has begun",
                        result
                ));
    }




    @PutMapping("/cancel/{dispatchId}")
    public void cancelTracking(
            @PathVariable @NotBlank(message = "Dispatch ID cannot be blank") Long dispatchId
    ) {

        TrackingModel trackingModel = trackingService.findByDispatchId(dispatchId);


        UtilRecords.DispatchEndedDTO dispatchEndedDTO = new UtilRecords.DispatchEndedDTO(true, LocalDateTime.now(),trackingModel.getVehicleIdentificationNumber(),trackingModel.getDispatchRequester(),trackingModel.getVehicleName(),dispatchId);
         userNotificationService.completedDispatchNotification(dispatchEndedDTO);
    }
}
