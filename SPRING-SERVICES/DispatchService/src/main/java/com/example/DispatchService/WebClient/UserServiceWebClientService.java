package com.example.DispatchService.WebClient;

import com.example.DispatchService.Messaging.WebClient.WebClientHelper;
import com.example.DispatchService.Utils.ApiResponse;
import com.example.DispatchService.Utils.UtilRecords;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * Handles communication with the User Service.
 * All outbound calls are wrapped in {@link WebClientHelper#safeCall} so that
 * any errors are returned inside an {@link ApiResponse} instead of throwing exceptions.
 */
@Service
public class UserServiceWebClientService {

    private final WebClient userWebClient;
    private final WebClientHelper webClientHelper;

    public UserServiceWebClientService(WebClient userWebClient,
                                       WebClientHelper webClientHelper) {
        this.userWebClient = userWebClient;
        this.webClientHelper = webClientHelper;
    }

    /**
     * Updates a user's dispatch score in the User Service.
     *
     * @param scoreUpdate DTO containing score update details
     * @return ApiResponse wrapping the User Service response
     */
    public ApiResponse<Map<String, Object>> updateUserDispatchScore(UtilRecords.DispatchScoreUpdateDto scoreUpdate) {
        return webClientHelper.safeCall(
                userWebClient.post()
                        .uri("/internal/auth/dispatch/update-score")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(scoreUpdate)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }


    public ApiResponse<Map<String, Object>> checkDispatchEligibility(UtilRecords.IsValidForDispatchRequest scoreUpdate) {
        return webClientHelper.safeCall(
                userWebClient.post()
                        .uri("/internal/auth/dispatch/dispatchable-user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(scoreUpdate)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }
}


