package com.tracker.loggingtrackingservice.G.V1.WebClient;

import com.tracker.loggingtrackingservice.G.V1.Messaging.WebClient.WebClientHelper;
import com.tracker.loggingtrackingservice.G.V1.Utils.ApiResponse;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class DispatchServiceWebClient {

    private final WebClient dispatchWebClient;
    private final WebClientHelper webClientHelper;

    public DispatchServiceWebClient(WebClient dispatchWebClient, WebClientHelper webClientHelper) {
        this.dispatchWebClient = dispatchWebClient;
        this.webClientHelper = webClientHelper;
    }

    /**
     * Sends a "dispatch completed" event to the Dispatch Service.
     *
     * @param event DTO containing the completed dispatch data.
     * @return ApiResponse containing the remote service's response body or error details.
     *         - On success: `true` flag with returned Map data (may be empty/null).
     *         - On failure: `false` flag with HTTP error code and message.
     */
    public ApiResponse<Map<String, Object>> sendDispatchCompletedMessage(UtilRecords.DispatchEndedDTO event) {
        return webClientHelper.safeCall(
                dispatchWebClient.post()
                        .uri("/internal/dispatch/complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(event)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }

    /**
     * Sends a "start tracking" event to the Dispatch Service.
     *
     * @param dispatchRequest DTO containing the tracking initialization details.
     * @return ApiResponse containing the remote service's response body or error details.
     *         - On success: `true` flag with returned Map data (may be empty/null).
     *         - On failure: `false` flag with HTTP error code and message.
     */
    public ApiResponse<Map<String, Object>> sendTrackingInitializationMessage(UtilRecords.StartTrackingDTO dispatchRequest) {
        return webClientHelper.safeCall(
                dispatchWebClient.post()
                        .uri("/internal/dispatch/track/start")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(dispatchRequest)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }
}
