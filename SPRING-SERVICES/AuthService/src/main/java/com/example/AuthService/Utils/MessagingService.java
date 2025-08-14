package com.example.AuthService.Utils;

public interface MessagingService {
    ApiResponse<UtilRecords.UserSyncResponse> sendAdminCreated(String email);
}
