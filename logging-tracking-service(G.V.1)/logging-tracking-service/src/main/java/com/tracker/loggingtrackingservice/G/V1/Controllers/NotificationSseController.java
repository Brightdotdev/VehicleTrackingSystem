package com.tracker.loggingtrackingservice.G.V1.Controllers;

import com.tracker.loggingtrackingservice.G.V1.Config.UserHandler;
import com.tracker.loggingtrackingservice.G.V1.Services.NotificationSseService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/v1/sse")
public class NotificationSseController {

    private final NotificationSseService notificationSseService;
    private final UserHandler userHandler;

    public NotificationSseController(NotificationSseService notificationSseService, UserHandler userHandler) {
        this.notificationSseService = notificationSseService;
        this.userHandler = userHandler;
    }

    // Client subscribes to this endpoint (can be user or admin)

    //  :: http://localhost:8104/v1/sse/subscribe
    @GetMapping(path = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        String userEmail =  userHandler.getCurrentUser();
        return notificationSseService.subscribe(userEmail);
    }



}
