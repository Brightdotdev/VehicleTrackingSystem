package com.tracker.loggingtrackingservice.G.V1.Controllers;

import com.tracker.loggingtrackingservice.G.V1.Models.TrackingModel;
import com.tracker.loggingtrackingservice.G.V1.RabbitMq.RabbitMqReceiverService;
import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Services.TrackingService;
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
    private final NotificationService notificationService;
    private final RabbitMqReceiverService rabbitMqReceiverService;

    // Constructor injection of the TrackingService
    public TrackingController(TrackingService trackingService, NotificationService notificationService, RabbitMqReceiverService rabbitMqReceiverService) {

        this.trackingService = trackingService;
        this.notificationService = notificationService;
        this.rabbitMqReceiverService = rabbitMqReceiverService;
    }

    /**
     * Endpoint to revalidate a tracking record
     */
    @PutMapping("/revalidate/{dispatchId}")
    public ResponseEntity<TrackingModel> revalidateTracking(
            @PathVariable @NotBlank(message = "Dispatch ID cannot be blank") Long dispatchId,
            @Valid @RequestBody UtilRecords.CheckPoint checkPoint
            ) {
        TrackingModel result = trackingService.revalidateTrackingPosition(dispatchId, checkPoint);
        return ResponseEntity.ok(result);
    }

    /**
     * Endpoint to start a tracking
     */
    @PutMapping("/start/{dispatchId}")
    public ResponseEntity<TrackingModel> startTracking(
            @PathVariable @NotBlank(message = "Dispatch ID cannot be blank") Long dispatchId,
            @Valid @RequestBody UtilRecords.CheckPoint checkPoint

    ) {
        TrackingModel result = trackingService.startTracking(dispatchId,checkPoint);
        return ResponseEntity.ok(result);
    }




    @PutMapping("/cancel/{dispatchId}")
    public void cancelTracking(
            @PathVariable @NotBlank(message = "Dispatch ID cannot be blank") Long dispatchId
    ) {

        TrackingModel trackingModel = trackingService.findByDispatchId(dispatchId);


        UtilRecords.DispatchEndedDTO dispatchEndedDTO = new UtilRecords.DispatchEndedDTO(true, LocalDateTime.now(),trackingModel.getVehicleIdentificationNumber(),trackingModel.getDispatchRequester(),trackingModel.getVehicleName(),dispatchId);

         notificationService.completedDispatchNotification(dispatchEndedDTO);
        rabbitMqReceiverService.handleDispatchCompleted(dispatchEndedDTO);

    }
}
