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
public class VehicleWebClientService {

    private final WebClient vehicleWebClient;
    private final WebClientHelper webClientHelper;

    public VehicleWebClientService(WebClient vehicleWebClient, WebClientHelper webClientHelper) {
        this.vehicleWebClient = vehicleWebClient;
        this.webClientHelper = webClientHelper;
    }

    /**
     * Sends a message to the Vehicle Service indicating that a dispatch has been completed.
     * @param event DTO containing dispatch completion details.
     * @return ApiResponse containing either success data from the Vehicle Service or error details.
     */
    public ApiResponse<Map<String, Object>> sendDispatchCompletedMessage(UtilRecords.DispatchEndedDTO event) {
        return webClientHelper.safeCall(
                vehicleWebClient.post()
                        .uri("/internal/vehicle/dispatch-completed/logs-service")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(event)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }

    /**
     * Sends a tracking initialization request to the Vehicle Service.
     * @param event DTO containing tracking start details.
     * @return ApiResponse containing either success data or error details.
     */
    public ApiResponse<Map<String, Object>> sendTrackingInitializationMessage(UtilRecords.StartTrackingDTO event) {
        return webClientHelper.safeCall(
                vehicleWebClient.post()
                        .uri("/internal/vehicle/track-start")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(event)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }

    /**
     * Sends a checkpoint (vehicle location update) to the Vehicle Service.
     * @param event DTO containing location update data.
     * @return ApiResponse containing either success data or error details.
     */
    public ApiResponse<Map<String, Object>> sendCheckPoint(UtilRecords.vehicleLocationUpdate event) {
        return webClientHelper.safeCall(
                vehicleWebClient.post()
                        .uri("/internal/vehicle/vehicle-location-update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(event)
                        .retrieve()
                        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        );
    }
}
