package com.tracker.loggingtrackingservice.G.V1.Controllers;

import com.tracker.loggingtrackingservice.G.V1.Models.NotificationModel;
import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Utils.ApiResponse;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/user/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }




//    ✅ GETs notifications after a particular time : Set notifications as read Endpoint: /v1/user/notifications/new-after
    @GetMapping("/new-after")
    public List<NotificationModel> getNewNotifications(
            @RequestParam String since
    ) {
        return notificationService.getNotificationsAfter(since);
    }



    /**
     * ✅ POST: Set notifications as read
     * Endpoint: /v1/user/notifications/set-read
     */
    @PostMapping("/set-read")
    public ResponseEntity<ApiResponse<List<NotificationModel>>> setNotificationToRead(
            @RequestParam String user,
            @Valid @RequestBody List<UtilRecords.setReadRecord> notificationRecordList
    ) {
        List<NotificationModel> updatedNotifications =
                notificationService.setNotificationToRead(notificationRecordList, user);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Notifications updated",
                        updatedNotifications
                ));
    }

    /**
     * ✅ GET: Fetch all notifications for the current user
     * Endpoint: /v1/user/notifications/get-all-me
     */
    @GetMapping("/get-all-me")
    public ResponseEntity<ApiResponse<List<NotificationModel>>> getAllMyNotification(
            @RequestParam String clientId) {

        List<NotificationModel> myNotifications = notificationService.getAllMyNotifications(clientId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Notifications received",
                        myNotifications
                ));
    }
}
