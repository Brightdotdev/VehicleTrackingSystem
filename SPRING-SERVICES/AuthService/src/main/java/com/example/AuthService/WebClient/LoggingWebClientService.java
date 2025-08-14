package com.example.AuthService.WebClient;

import com.example.AuthService.Config.WebClientHelper;
import com.example.AuthService.Utils.ApiResponse;
import com.example.AuthService.Utils.MessagingService;
import com.example.AuthService.Utils.UtilRecords;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class LoggingWebClientService implements MessagingService {


    private final WebClient loggingWebClient;
    private final WebClientHelper webClientHelper;

    public LoggingWebClientService(WebClient loggingWebClient, WebClientHelper webClientHelper) {
        this.loggingWebClient = loggingWebClient;
        this.webClientHelper = webClientHelper;
    }



    @Override
    public ApiResponse<UtilRecords.UserSyncResponse> sendAdminCreated(String email) {
        var requestBody = new UtilRecords.adminCreatedRequestBodyDto(email);

        return webClientHelper.safeCall(
                loggingWebClient.post()
                        .uri("/internal/logs/admin/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<UtilRecords.UserSyncResponse>() {})
        );

    }
}
