package com.tracker.loggingtrackingservice.G.V1.Controllers;

import com.tracker.loggingtrackingservice.G.V1.Models.NotificationModel;
import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Utils.ApiResponse;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/user/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    // Constructor-based dependency injection
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }



    /**
     * Endpoint to set the read notifications to read grah
     */

    //  :: http://localhost:8104/v1/user/notifications/set-read
    @PostMapping("/set-read")
    public ResponseEntity<ApiResponse<List<UtilRecords.NotificationDto>>> setNotificationToRead(
            @Valid @RequestParam String user,
           @Valid @RequestBody List<UtilRecords.setReadRecord> notificationRecordList
    ) {
      List<UtilRecords.NotificationDto>  updatedNotification = notificationService.setNotificationToRead(notificationRecordList,user);


        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Notifications updated",
                        updatedNotification
                ));}


        /**
     * get all the user's notification
     */


    @GetMapping("/get-all-me")
    public ResponseEntity<ApiResponse<List<NotificationModel>>> getAllMyNotification(
            @Valid @RequestParam String clientId) {


      List<NotificationModel>  myNotifications = notificationService.getAllMyNotifications(clientId);


      return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Notifications received",
                        myNotifications
                ));}
}
