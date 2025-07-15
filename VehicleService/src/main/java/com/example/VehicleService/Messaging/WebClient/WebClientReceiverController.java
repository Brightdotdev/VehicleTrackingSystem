package com.example.VehicleService.Messaging.WebClient;


import com.example.VehicleService.Services.VehicleService;
import com.example.VehicleService.Utils.ApiResponse;
import com.example.VehicleService.Utils.UtilRecords;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/internal/vehicle")
public class WebClientReceiverController {

    private static final Logger logger = LoggerFactory.getLogger(WebClientReceiverController.class);


    private final VehicleService vehicleService;

    public WebClientReceiverController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }


    // :: localhost:8106/internal/vehicle/handle-dispatch-request
    @PostMapping("/handle-dispatch-request")
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleCreateDispatch(
            @Valid @RequestBody UtilRecords.dispatchRequestBodyDTO dispatchEvent
    ) {

        Map<String, Object> vehicle = vehicleService.handleDispatchRequest(dispatchEvent);
        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Dispatch request retrieved",
                        vehicle
                ));
    }

    // :: localhost:8106/internal/vehicle/dispatch-validated

    /**
     * ✅ Dispatch validated
     */
    @PostMapping("/dispatch-validated")
    public ResponseEntity<?> handleDispatchValidated(@RequestBody UtilRecords.ValidatedDispatch dispatchEvent) {
        try {
            vehicleService.handleValidatedDispatch(dispatchEvent);
            return ResponseEntity.ok("Validated dispatch handled");
        } catch (Exception e) {
            logger.error("Error handling validated dispatch", e);
            return ResponseEntity.internalServerError().body("Error processing validated dispatch");
        }
    }



    /**
     * ✅ Dispatch completed (from dispatch service)
     */
    @PostMapping("/dispatch-completed/dispatch-service")
    @Transactional
    public ResponseEntity<?> handleDispatchCompletedFromDispatch(@RequestBody UtilRecords.DispatchEndedDTO dispatchEvent) {
        try {
            vehicleService.completedDispatch(dispatchEvent);
            return ResponseEntity.ok("Dispatch completed (dispatch service)");
        } catch (Exception e) {
            logger.error("Error handling completed dispatch (dispatch service)", e);
            return ResponseEntity.internalServerError().body("Error processing completed dispatch");
        }
    }

    /**
     * ✅ Dispatch completed (from logs service)
     */
    @PostMapping("/dispatch-completed/logs-service")
    @Transactional
    public ResponseEntity<?> handleDispatchCompletedFromLogs(@RequestBody UtilRecords.DispatchEndedDTO dispatchEvent) {
        try {
            vehicleService.completedDispatch(dispatchEvent);
            return ResponseEntity.ok("Dispatch completed (logs service)");
        } catch (Exception e) {
            logger.error("Error handling completed dispatch (logs service)", e);
            return ResponseEntity.internalServerError().body("Error processing completed dispatch");
        }
    }




    /**
     * ✅ Dispatch tracking event
     */
    @PostMapping("/track-start")
    @Transactional
    public ResponseEntity<?> handleDispatchTracking(@RequestBody UtilRecords.StartTrackingDTO trackingEvent) {
        if (trackingEvent == null || trackingEvent.dispatchId() == null) {
            logger.warn("Invalid tracking event");
            return ResponseEntity.badRequest().body("Missing dispatchId in tracking event");
        }

        try {
            logger.info("Tracking event received: {}", trackingEvent);
            vehicleService.handleDispatchTracking(trackingEvent);
            return ResponseEntity.ok("Tracking event handled");
        } catch (Exception e) {
            logger.error("Error handling tracking event", e);
            return ResponseEntity.internalServerError().body("Error processing tracking event");
        }
    }

    /**
     * ✅ Vehicle location update
     */
    @PostMapping("/vehicle-location-update")
    @Transactional
    public ResponseEntity<?> handleVehicleLocationUpdate(@RequestBody UtilRecords.vehicleLocationUpdate update) {
        if (update == null || update.vehicleIdentificationNumber() == null) {
            logger.warn("Invalid vehicle location update");
            return ResponseEntity.badRequest().body("Missing VIN in location update");
        }

        try {
            vehicleService.handleVehicleLocationUpdate(update);
            return ResponseEntity.ok("Vehicle location updated");
        } catch (Exception e) {
            logger.error("Error handling vehicle location update", e);
            return ResponseEntity.internalServerError().body("Error processing location update");
        }
    }
}
