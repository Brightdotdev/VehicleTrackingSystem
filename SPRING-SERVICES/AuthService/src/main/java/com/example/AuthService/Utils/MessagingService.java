package com.example.AuthService.Utils;

import java.util.Map;

public interface MessagingService {
    ApiResponse<Map<String, Object>> sendAdminCreated(String email);
}
