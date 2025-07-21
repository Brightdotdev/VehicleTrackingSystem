package com.tracker.loggingtrackingservice.G.V1.Controllers;

import com.tracker.loggingtrackingservice.G.V1.Models.UserNotificationModel;
import com.tracker.loggingtrackingservice.G.V1.Services.UserNotificationService;
import com.tracker.loggingtrackingservice.G.V1.Utils.ApiResponse;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/user/notifications")
public class UserNotificationController {

    private final UserNotificationService userNotificationService;

    public UserNotificationController(UserNotificationService userNotificationService) {
        this.userNotificationService = userNotificationService;
    }




//    ✅ GETs notifications after a particular time : Set notifications as read Endpoint: /v1/user/notifications/new-after
    @GetMapping("/new-after")
    public   ResponseEntity<ApiResponse<List<UserNotificationModel>>>  getNewNotifications(
            @RequestParam String since
    ) {
        List<UserNotificationModel> newNotifications =  userNotificationService.getNotificationsAfter(since);
        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Notifications updated",
                        newNotifications
                ));

    }



    /**
     * ✅ POST: Set notifications as read
     * Endpoint: /v1/user/notifications/set-read
     */
    @PostMapping("/set-read")
    public ResponseEntity<ApiResponse<List<UserNotificationModel>>> setNotificationToRead(
            @RequestParam String user,
            @Valid @RequestBody List<UtilRecords.setReadRecord> notificationRecordList
    ) {
        List<UserNotificationModel> updatedNotifications =
                userNotificationService.setNotificationToRead(notificationRecordList, user);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Notifications updated",
                        updatedNotifications
                ));
    }

    /**
     * ✅ GET: Fetch all notifications for the current user
     * Endpoint: /v1/user/notifications/get-all-me
     */
    @GetMapping("/get-all-me")
    public ResponseEntity<ApiResponse<List<UserNotificationModel>>> getAllMyNotification() {

        List<UserNotificationModel> myNotifications = userNotificationService.getAllMyNotifications();

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Notifications received",
                        myNotifications
                ));
    }
}
