package com.tracker.loggingtrackingservice.G.V1.Controllers;

import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/user/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    // Constructor-based dependency injection
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Endpoint to send a created dispatch notification.
     * Accepts a JSON body representing dispatch request details.
     */
    @PostMapping("/dispatch-created")
    public ResponseEntity<String> sendDispatchCreatedNotification(
           @Valid @RequestBody UtilRecords.dispatchRequestBodyDTO dispatchRequestBody
    ) {
        notificationService.sendCreatedDispatchNotification(dispatchRequestBody);
        return ResponseEntity.ok("Notification sent successfully.");
    }
}
