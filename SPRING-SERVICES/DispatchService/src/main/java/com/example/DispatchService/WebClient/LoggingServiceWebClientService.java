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
 * Handles communication with the Logging Service.
 * Every call is wrapped with {@link WebClientHelper#safeCall} so that
 * all responses are consistently returned as {@link ApiResponse} objects.
 * No exceptions bubble up to the caller.
 */
@Service
public class LoggingServiceWebClientService {

    private final WebClient loggingWebClient;
    private final WebClientHelper webClientHelper;

    public LoggingServiceWebClientService(WebClient loggingWebClient,
                                          WebClientHelper webClientHelper) {
        this.loggingWebClient = loggingWebClient;
        this.webClientHelper = webClientHelper;
    }

    /**
     * Notifies Logging Service that a dispatch was created.
     *
     * @param dispatchRequest DTO containing dispatch details
     * @return ApiResponse wrapping the Logging Service response
     */
    public ApiResponse<Map<String, Object>> notifyDispatchCreated(UtilRecords.dispatchRequestBodyDTO dispatchRequest) {
        return webClientHelper.safeCall(
                loggingWebClient.post()
                        .uri("/internal/logs/dispatch-created")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(dispatchRequest)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }

    /**
     * Notifies Logging Service that a dispatch was completed.
     *
     * @param dispatchRequest DTO containing completed dispatch details
     * @return ApiResponse wrapping the Logging Service response
     */
    public ApiResponse<Map<String, Object>> sendDispatchCompletedNotif(UtilRecords.DispatchEndedDTO dispatchRequest) {
        return webClientHelper.safeCall(
                loggingWebClient.post()
                        .uri("/internal/logs/dispatch-completed")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(dispatchRequest)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }

    /**
     * Notifies Logging Service that a dispatch was validated.
     *
     * @param dispatchRequest DTO containing validated dispatch details
     * @return ApiResponse wrapping the Logging Service response
     */
    public ApiResponse<Map<String, Object>> sendDispatchValidatedNotif(UtilRecords.ValidatedDispatch dispatchRequest) {
        return webClientHelper.safeCall(
                loggingWebClient.post()
                        .uri("/internal/logs/dispatch-validated")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(dispatchRequest)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }
}



