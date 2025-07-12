package com.example.DispatchService.Controller;

import com.example.DispatchService.Service.UserDispatchService;
import com.example.DispatchService.Utils.ApiResponse;
import com.example.DispatchService.Utils.UtilRecords;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/internal/dispatch")

public class DispatchInternalController {

    private static final Logger logger = LoggerFactory.getLogger(DispatchInternalController.class);
    private final UserDispatchService userDispatchService;

    public DispatchInternalController(UserDispatchService userDispatchService) {
        this.userDispatchService = userDispatchService;
    }

    @PostMapping("/complete")
    public ResponseEntity<ApiResponse<String>> handleDispatchCompletedFromLogs(
            @Valid @RequestBody UtilRecords.DispatchEndedDTO dispatchEvent
    ) {
        if (dispatchEvent == null || dispatchEvent.dispatchId() == null) {
            logger.warn("Invalid dispatchCompleted event: {}", dispatchEvent);
            return ResponseEntity.badRequest().body(ApiResponse.error(403,"Invalid dispatch event"));
        }

        try {
            userDispatchService.completeDispatch(dispatchEvent);
            return ResponseEntity.ok(ApiResponse.success(200,"Dispatch completed",null));
        } catch (Exception e) {
            logger.error("Error processing dispatchCompleted event: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(ApiResponse.error(403,"Processing failed"));
        }
    }

    @PostMapping("/track")
    public ResponseEntity<ApiResponse<String>> handleDispatchTrackingQueue(
            @Valid @RequestBody UtilRecords.StartTrackingDTO trackingEvent
    ) {
        if (trackingEvent == null || trackingEvent.dispatchId() == null) {
            logger.warn("Invalid startTracking event: {}", trackingEvent);
            return ResponseEntity.badRequest().body(ApiResponse.error(403, "Invalid tracking event"));
        }

        try {
            userDispatchService.handleDispatchTracking(trackingEvent);
            return ResponseEntity.ok(ApiResponse.success(200, "Tracking started",null));
        } catch (Exception e) {
            logger.error("Error processing startTracking event: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(ApiResponse.error(403, "Processing failed"));
        }
    }
}
