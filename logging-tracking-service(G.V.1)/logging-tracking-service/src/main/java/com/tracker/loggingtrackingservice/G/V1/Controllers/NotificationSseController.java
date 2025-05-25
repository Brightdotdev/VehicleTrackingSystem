package com.tracker.loggingtrackingservice.G.V1.Controllers;

import com.tracker.loggingtrackingservice.G.V1.Services.NotificationSseService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/v1/sse")
public class NotificationSseController {

    private final NotificationSseService notificationSseService;

    public NotificationSseController(NotificationSseService notificationSseService) {
        this.notificationSseService = notificationSseService;
    }

    // Client subscribes to this endpoint (can be user or admin)

    //  :: http://localhost:8104/v1/sse/subscribe
    @GetMapping("/subscribe")
    public SseEmitter subscribe(@RequestParam String clientId) {
        return notificationSseService.subscribe(clientId);
    }

    // Example endpoint to simulate user notification
    @PostMapping("/send-to-user")
    public void testUserNotify(@RequestParam String userId, @RequestBody String message) {
        notificationSseService.sendUserNotification(userId, message);
    }

    // Example endpoint to simulate admin notification
    @PostMapping("/send-to-admin")
    public void testAdminNotify(@RequestParam String adminId, @RequestBody String message) {
        notificationSseService.sendAdminNotification(adminId, message);
    }
}
