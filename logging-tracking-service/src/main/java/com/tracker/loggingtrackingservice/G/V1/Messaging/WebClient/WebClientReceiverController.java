package com.tracker.loggingtrackingservice.G.V1.Messaging.WebClient;

import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Services.TrackingService;
import com.tracker.loggingtrackingservice.G.V1.Services.UserHandlerService;
import com.tracker.loggingtrackingservice.G.V1.Utils.ApiResponse;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import com.tracker.loggingtrackingservice.G.V1.Messaging.WebClient.WebClientJsonMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.tracker.loggingtrackingservice.G.V1.Messaging.ExceptionWrapper.wrapExceptions;

@RestController
@RequestMapping("/internal/logs")
public class WebClientReceiverController {

    private static final Logger logger = LoggerFactory.getLogger(WebClientReceiverController.class);

    private final NotificationService notificationService;
    private final TrackingService trackingService;
    private final UserHandlerService userHandlerService;
    private final WebClientJsonMapper jsonMapper;

    public WebClientReceiverController(
            NotificationService notificationService,
            TrackingService trackingService,
            UserHandlerService userHandlerService,
            WebClientJsonMapper jsonMapper
    ) {
        this.notificationService = notificationService;
        this.trackingService = trackingService;
        this.userHandlerService = userHandlerService;
        this.jsonMapper = jsonMapper;
    }

    @PostMapping("/admin/create")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createAdmin(@RequestBody UtilRecords.adminCreatedRequestBodyDto requestBody) {
        logger.info("📦 Received /admin/create payload: {}", jsonMapper.convertToJson(requestBody));

        return wrapExceptions(() -> {
            Map<String, Object> result = userHandlerService.createIfNotExists(requestBody);
            return ResponseEntity.ok(ApiResponse.success(200, "User synced successfully", result));
        });
    }

    @PostMapping("/dispatch-created")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> handleDispatchCreatedNotification(@RequestBody UtilRecords.dispatchRequestBodyDTO event) {
        logger.info("📦 Received /dispatch-created payload: {}", jsonMapper.convertToJson(event));

        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("Invalid dispatchCreated event received: {}", event);
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Invalid dispatchCreated event"));
        }

        return wrapExceptions(() -> {
            notificationService.sendCreatedDispatchNotification(event);
            notificationService.sendCreatedDispatchNotificationsForAdmin(event);
            return ResponseEntity.ok(ApiResponse.ok(200, "Dispatch created processed"));
        });
    }

    @PostMapping("/dispatch-completed")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> handleDispatchCompleted(@RequestBody UtilRecords.DispatchEndedDTO event) {
        logger.info("📦 Received /dispatch-completed payload: {}", jsonMapper.convertToJson(event));

        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid dispatchCompleted event received: {}", event);
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Invalid dispatchCompleted event"));
        }

        return wrapExceptions(() -> {
            notificationService.completedDispatchNotification(event);
            return ResponseEntity.ok(ApiResponse.ok(200, "Dispatch completed processed"));
        });
    }

    @PostMapping("/dispatch-validated")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> handleDispatchValidated(@RequestBody UtilRecords.ValidatedDispatch event) {
        logger.info("📦 Received /dispatch-validated payload: {}", jsonMapper.convertToJson(event));

        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid validatedDispatch event received: {}", event);
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Invalid validatedDispatch event"));
        }

        return wrapExceptions(() -> {
            notificationService.handleValidatedDispatchNotif(event);
            trackingService.handleValidatedDispatchTracking(event);
            return ResponseEntity.ok(ApiResponse.ok(200, "Validated dispatch processed"));
        });
    }

    @PostMapping("/start-tracking")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> handleTrackingDispatchNotif(@RequestBody UtilRecords.StartTrackingDTO trackingEvent) {
        logger.info("📦 Received /start-tracking payload: {}", jsonMapper.convertToJson(trackingEvent));

        if (trackingEvent == null || trackingEvent.dispatchId() == null) {
            logger.warn("Invalid tracking event received: {}", trackingEvent);
            return ResponseEntity.badRequest().body(ApiResponse.error(400, "Invalid tracking event"));
        }

        return wrapExceptions(() -> {
            notificationService.handleDispatchTracking(trackingEvent);
            return ResponseEntity.ok(ApiResponse.ok(200, "Tracking dispatch processed"));
        });
    }
}
