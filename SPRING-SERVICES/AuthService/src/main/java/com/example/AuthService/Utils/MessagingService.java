package com.example.AuthService.Utils;

import reactor.core.publisher.Mono;

import java.util.Map;

public interface MessagingService {
    Mono<ApiResponse<Map<String, Object>>> sendAdminCreated(String email);
}
