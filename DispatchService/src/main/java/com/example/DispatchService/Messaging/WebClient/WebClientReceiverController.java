package com.example.DispatchService.Messaging.WebClient;

import com.example.DispatchService.Messaging.JsonMapper;
import com.example.DispatchService.Service.UserDispatchService;
import com.example.DispatchService.Utils.ApiResponse;
import com.example.DispatchService.Utils.UtilRecords;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.example.DispatchService.Messaging.WebClient.ExceptionWrapper.wrapExceptions;

@RestController
@RequestMapping("/internal/dispatch")
public class WebClientReceiverController {

    private static final Logger logger = LoggerFactory.getLogger(WebClientReceiverController.class);
    private final UserDispatchService userDispatchService;
    private final JsonMapper jsonMapper;

    public WebClientReceiverController(
            UserDispatchService userDispatchService,
            JsonMapper jsonMapper
    ) {
        this.userDispatchService = userDispatchService;
        this.jsonMapper = jsonMapper;
    }

    /**
     * ✅ Handle dispatch completion (logs service sends this)
     */
    @PostMapping("/complete")
    public ResponseEntity<ApiResponse<String>> handleDispatchCompletedFromLogs(
            @Valid @RequestBody UtilRecords.DispatchEndedDTO dispatchEvent
    ) {
        return wrapExceptions(() -> {
            // Log received data as JSON
            logger.info("📦 Received /complete payload: {}", jsonMapper.convertToJson(dispatchEvent));

            if (dispatchEvent == null || dispatchEvent.dispatchId() == null) {
                throw new IllegalArgumentException("Invalid dispatch event");
            }

            userDispatchService.completeDispatch(dispatchEvent);
            return ResponseEntity.ok(ApiResponse.ok(200, "Dispatch completed"));
        });
    }

    /**
     * ✅ Handle dispatch tracking (logs service sends this)
     */
    @PostMapping("/track")
    public ResponseEntity<ApiResponse<String>> handleDispatchTrackingQueue(
            @Valid @RequestBody UtilRecords.StartTrackingDTO trackingEvent
    ) {
        return wrapExceptions(() -> {
            // Log received data as JSON
            logger.info("📦 Received /track payload: {}", jsonMapper.convertToJson(trackingEvent));

            if (trackingEvent == null || trackingEvent.dispatchId() == null) {
                throw new IllegalArgumentException("Invalid tracking event");
            }

            userDispatchService.handleDispatchTracking(trackingEvent);
            return ResponseEntity.ok(ApiResponse.ok(200, "Tracking started"));
        });
    }
}
