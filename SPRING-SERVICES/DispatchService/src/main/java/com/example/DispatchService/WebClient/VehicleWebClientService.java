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
 * Handles communication with the Vehicle Service.
 * All outbound calls use {@link WebClientHelper#safeCall} to wrap responses in ApiResponse
 * and handle errors gracefully without throwing exceptions.
 */
@Service
public class VehicleWebClientService {

    private final WebClient vehicleWebClient;
    private final WebClientHelper webClientHelper;

    public VehicleWebClientService(WebClient vehicleWebClient,
                                   WebClientHelper webClientHelper) {
        this.vehicleWebClient = vehicleWebClient;
        this.webClientHelper = webClientHelper;
    }

    /**
     * Sends a dispatch request to the Vehicle Service.
     *
     * @param dispatchRequest DTO containing dispatch request data
     * @return ApiResponse wrapping the Vehicle Service response
     */
    public ApiResponse<Map<String, Object>> sendDispatchRequested(UtilRecords.dispatchRequestBodyDTO dispatchRequest) {
        return webClientHelper.safeCall(
                vehicleWebClient.post()
                        .uri("/internal/vehicle/handle-dispatch-request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(dispatchRequest)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }

    /**
     * Sends a dispatch validated notification to the Vehicle Service.
     *
     * @param dispatchRequest DTO containing validated dispatch details
     * @return ApiResponse wrapping the Vehicle Service response
     */
    public ApiResponse<Map<String, Object>> sendDispatchValidatedMessage(UtilRecords.ValidatedDispatch dispatchRequest) {
        return webClientHelper.safeCall(
                vehicleWebClient.post()
                        .uri("/internal/vehicle/dispatch-validated")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(dispatchRequest)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }

    /**
     * Sends a dispatch completed notification to the Vehicle Service.
     *
     * @param dispatchRequest DTO containing completed dispatch details
     * @return ApiResponse wrapping the Vehicle Service response
     */
    public ApiResponse<Map<String, Object>> sendDispatchCompletedMessage(UtilRecords.DispatchEndedDTO dispatchRequest) {
        return webClientHelper.safeCall(
                vehicleWebClient.post()
                        .uri("/internal/vehicle/dispatch-completed/dispatch-service")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(dispatchRequest)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }
}


