package com.tracker.loggingtrackingservice.G.V1.Controllers;


import com.tracker.loggingtrackingservice.G.V1.Models.AdminNotificationModel;
import com.tracker.loggingtrackingservice.G.V1.Models.UserNotificationModel;
import com.tracker.loggingtrackingservice.G.V1.Services.AdminNotificationService;
import com.tracker.loggingtrackingservice.G.V1.Utils.ApiResponse;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/notifications")
public class AdminNotificationController {



    private final AdminNotificationService adminNotificationService;

    public AdminNotificationController(AdminNotificationService adminNotificationService) {
        this.adminNotificationService = adminNotificationService;
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminNotificationModel>>> getAdminNotifications() {


        List<AdminNotificationModel> adminNotificationModels = adminNotificationService.getAdminNotifications();


        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Notifications retrieved for admins",
                        adminNotificationModels
                ));}

    @GetMapping("/new-after")
    public ResponseEntity<ApiResponse<List<AdminNotificationModel>>> getLatestNotificationAfter(
            @RequestParam String since
    ) {


        List<AdminNotificationModel> adminNotificationModels = adminNotificationService.getNotificationsAfter(since);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Latest Notifications retrieved for admins",
                        adminNotificationModels
                ));}



    @PostMapping("/set-read")
    public ResponseEntity<ApiResponse<List<AdminNotificationModel>>> setNotificationToRead(
            @RequestParam String user,
            @Valid @RequestBody List<UtilRecords.setReadRecord> notificationRecordList
    ) {
        List<AdminNotificationModel> updatedNotifications =
                adminNotificationService.setNotificationToRead(notificationRecordList, user);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Notifications updated",
                        updatedNotifications
                ));
    }


}
