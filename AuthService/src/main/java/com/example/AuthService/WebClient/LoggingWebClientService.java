package com.example.AuthService.WebClient;



import com.example.AuthService.Utils.ApiResponse;
import com.example.AuthService.Utils.UtilRecords;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoggingWebClientService {

    private final WebClient loggingWebClient;

    public LoggingWebClientService(@Qualifier("loggingWebClient") WebClient loggingWebClient) {
        this.loggingWebClient = loggingWebClient;
    }

    public Mono<ApiResponse<Map<String, Object>>> sendAdminCreated(String email) {
        var requestBody = new UtilRecords.adminCreatedRequestBodyDto(email);




        return loggingWebClient.post()
                .uri("/internal/logs/admin/create")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {})
                .onErrorResume(ex -> {
                    Map<String, Object> fallback = new HashMap<>();
                    fallback.put("createdNew", false);
                    fallback.put("error", ex.getMessage());

                    ApiResponse<Map<String, Object>> fallbackResponse =
                            ApiResponse.error(500, "Internal call failed");

                    return Mono.just(fallbackResponse);
                });
    }
}
