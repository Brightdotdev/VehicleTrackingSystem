package com.example.AuthService.WebClient;

import com.example.AuthService.Config.WebClientHelper;
import com.example.AuthService.Utils.ApiResponse;
import com.example.AuthService.Utils.MessagingService;
import com.example.AuthService.Utils.UtilRecords;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class LoggingWebClientService implements MessagingService {

    private final WebClientHelper webClientHelper;

    public LoggingWebClientService(WebClientHelper webClientHelper) {
        this.webClientHelper = webClientHelper;
    }



    @Override
    public Mono<ApiResponse<Map<String, Object>>> sendAdminCreated(String email) {
        var requestBody = new UtilRecords.adminCreatedRequestBodyDto(email);

        // Use the generic helper to send the POST request
        return webClientHelper.post(
                "/internal/logs/admin/create",
                requestBody,
                new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {}
        );
    }
}
