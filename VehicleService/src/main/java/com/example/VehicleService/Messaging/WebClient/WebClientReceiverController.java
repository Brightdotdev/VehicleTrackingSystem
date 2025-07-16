package com.example.VehicleService.Messaging.WebClient;


import com.example.VehicleService.Messaging.JsonMapper;
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
import static com.example.VehicleService.Messaging.ExceptionWrapper.wrapExceptions;

@RestController
@RequestMapping("/internal/vehicle")
public class WebClientReceiverController {

    private static final Logger logger = LoggerFactory.getLogger(WebClientReceiverController.class);

    private final VehicleService vehicleService;
    private final JsonMapper jsonMapper;

    public WebClientReceiverController(VehicleService vehicleService, JsonMapper jsonMapper) {
        this.vehicleService = vehicleService;
        this.jsonMapper = jsonMapper;
    }

    @PostMapping("/handle-dispatch-request")
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleCreateDispatch(
            @Valid @RequestBody UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
        logger.info("📥 Received dispatch request: {}", jsonMapper.convertToJson(dispatchEvent));

        return wrapExceptions(() -> {
            Map<String, Object> vehicle = vehicleService.handleDispatchRequest(dispatchEvent);
            return ResponseEntity.ok(ApiResponse.success(200, "Dispatch request retrieved", vehicle));
        });
    }

    @PostMapping("/dispatch-validated")
    public ResponseEntity<ApiResponse<String>> handleDispatchValidated(@RequestBody UtilRecords.ValidatedDispatch dispatchEvent) {
        logger.info("📥 Received validated dispatch: {}", jsonMapper.convertToJson(dispatchEvent));

        return wrapExceptions(() -> {
            vehicleService.handleValidatedDispatch(dispatchEvent);
            return ResponseEntity.ok(ApiResponse.ok(200, "Validated dispatch handled"));
        });
    }

    @PostMapping("/dispatch-completed/dispatch-service")
    @Transactional
    public ResponseEntity<ApiResponse<String>> handleDispatchCompletedFromDispatch(@RequestBody UtilRecords.DispatchEndedDTO dispatchEvent) {
        logger.info("📥 Received completed dispatch from dispatch service: {}", jsonMapper.convertToJson(dispatchEvent));

        return wrapExceptions(() -> {
            vehicleService.completedDispatch(dispatchEvent);
            return ResponseEntity.ok(ApiResponse.ok(200, "Dispatch completed (dispatch service)"));
        });
    }

    @PostMapping("/dispatch-completed/logs-service")
    @Transactional
    public ResponseEntity<ApiResponse<String>> handleDispatchCompletedFromLogs(@RequestBody UtilRecords.DispatchEndedDTO dispatchEvent) {
        logger.info("📥 Received completed dispatch from logs service: {}", jsonMapper.convertToJson(dispatchEvent));

        return wrapExceptions(() -> {
            vehicleService.completedDispatch(dispatchEvent);
            return ResponseEntity.ok(ApiResponse.ok(200, "Dispatch completed (logs service)"));
        });
    }

    @PostMapping("/track-start")
    @Transactional
    public ResponseEntity<ApiResponse<String>> handleDispatchTracking(@RequestBody UtilRecords.StartTrackingDTO trackingEvent) {
        logger.info("📥 Received start tracking event: {}", jsonMapper.convertToJson(trackingEvent));

        return wrapExceptions(() -> {
            if (trackingEvent == null || trackingEvent.dispatchId() == null) {
                throw new IllegalArgumentException("Missing dispatchId in tracking event");
            }
            vehicleService.handleDispatchTracking(trackingEvent);
            return ResponseEntity.ok(ApiResponse.ok(200, "Tracking event handled"));
        });
    }

    @PostMapping("/vehicle-location-update")
    @Transactional
    public ResponseEntity<ApiResponse<String>> handleVehicleLocationUpdate(@RequestBody UtilRecords.vehicleLocationUpdate update) {
        logger.info("📥 Received vehicle location update: {}", jsonMapper.convertToJson(update));

        return wrapExceptions(() -> {
            if (update == null || update.vehicleIdentificationNumber() == null) {
                throw new IllegalArgumentException("Missing VIN in location update");
            }
            vehicleService.handleVehicleLocationUpdate(update);
            return ResponseEntity.ok(ApiResponse.ok(200, "Vehicle location updated"));
        });
    }
}
