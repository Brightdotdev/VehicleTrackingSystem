package com.tracker.loggingtrackingservice.G.V1.Messaging.WebClient;

import com.tracker.loggingtrackingservice.G.V1.Models.AdminModel;
import com.tracker.loggingtrackingservice.G.V1.Repositories.AdminRepository;
import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Services.TrackingService;
import com.tracker.loggingtrackingservice.G.V1.Services.UserHandlerService;
import com.tracker.loggingtrackingservice.G.V1.Utils.ApiResponse;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/internal/logs")
public class WebClientReceiverController {

    private static final Logger logger = LoggerFactory.getLogger(WebClientReceiverController.class);

    private final NotificationService notificationService;
    private final TrackingService trackingService;
    private final UserHandlerService userHandlerService;

    public WebClientReceiverController(NotificationService notificationService, TrackingService trackingService, UserHandlerService userHandlerService) {
        this.notificationService = notificationService;
        this.trackingService = trackingService;
        this.userHandlerService = userHandlerService;
    }



    @PostMapping("/admin/create")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createAdmin(@RequestBody UtilRecords.adminCreatedRequestBodyDto requestBody) {
        Map<String, Object> result = userHandlerService.createIfNotExists(requestBody);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "User synced successfully",
                        result
                ));
    }



    /**
     * ✅ Dispatch created
     */
    @PostMapping("/dispatch-created")
    @Transactional
    public ResponseEntity<?> handleDispatchCreatedNotification(@RequestBody UtilRecords.dispatchRequestBodyDTO event) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("Invalid dispatchCreated event received: {}", event);
            return ResponseEntity.badRequest().body("Invalid dispatchCreated event");
        }

        try {
            notificationService.sendCreatedDispatchNotification(event);
            notificationService.sendCreatedDispatchNotificationsForAdmin(event);
            return ResponseEntity.ok("Dispatch created processed");
        } catch (Exception e) {
            logger.error("Error handling dispatchCreated event: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Error processing dispatchCreated");
        }
    }

    /**
     * ✅ Dispatch completed or cancelled
     */
    @PostMapping("/dispatch-completed")
    @Transactional
    public ResponseEntity<?> handleDispatchCompleted(@RequestBody UtilRecords.DispatchEndedDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid dispatchCompleted event received: {}", event);
            return ResponseEntity.badRequest().body("Invalid dispatchCompleted event");
        }

        try {
            notificationService.completedDispatchNotification(event);
            return ResponseEntity.ok("Dispatch completed processed");
        } catch (Exception e) {
            logger.error("Error handling dispatchCompleted event: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Error processing dispatchCompleted");
        }
    }

    /**
     * ✅ Dispatch validated
     */
    @PostMapping("/dispatch-validated")
    @Transactional
    public ResponseEntity<?> handleDispatchValidated(@RequestBody UtilRecords.ValidatedDispatch event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid validatedDispatch event received: {}", event);
            return ResponseEntity.badRequest().body("Invalid validatedDispatch event");
        }

        try {
            notificationService.handleValidatedDispatchNotif(event);
            trackingService.handleValidatedDispatchTracking(event);
            return ResponseEntity.ok("Validated dispatch processed");
        } catch (Exception e) {
            logger.error("Error handling validatedDispatch event: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Error processing validatedDispatch");
        }
    }

    /**
     * ✅ Tracking dispatch
     */
    @PostMapping("/start-tracking")
    @Transactional
    public ResponseEntity<?> handleTrackingDispatchNotif(@RequestBody UtilRecords.StartTrackingDTO trackingEvent) {
        if (trackingEvent == null || trackingEvent.dispatchId() == null) {
            logger.warn("Invalid tracking event received: {}", trackingEvent);
            return ResponseEntity.badRequest().body("Invalid tracking event");
        }

        try {
            notificationService.handleDispatchTracking(trackingEvent);
            return ResponseEntity.ok("Tracking dispatch processed");
        } catch (Exception e) {
            logger.error("Error handling tracking dispatch notification: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Error processing tracking event");
        }
    }
}
