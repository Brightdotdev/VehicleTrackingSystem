package com.tracker.loggingtrackingservice.G.V1.Controllers;

import com.tracker.loggingtrackingservice.G.V1.Models.TrackingModel;
import com.tracker.loggingtrackingservice.G.V1.Services.TrackingService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/user/tracking")
public class TrackingController {

    private final TrackingService trackingService;

    // Constructor injection of the TrackingService
    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    /**
     * Endpoint to revalidate a tracking record
     */
    @PutMapping("/revalidate/{dispatchId}")
    public ResponseEntity<TrackingModel> revalidateTracking(
            @PathVariable @NotBlank(message = "Dispatch ID cannot be blank") String dispatchId
    ) {
        TrackingModel result = trackingService.revalidateTracking(dispatchId);
        return ResponseEntity.ok(result);
    }

    /**
     * Endpoint to start a tracking
     */
    @PutMapping("/start/{dispatchId}")
    public ResponseEntity<TrackingModel> startTracking(
            @PathVariable @NotBlank(message = "Dispatch ID cannot be blank") String dispatchId
    ) {
        TrackingModel result = trackingService.startTracking(dispatchId);
        return ResponseEntity.ok(result);
    }
}
