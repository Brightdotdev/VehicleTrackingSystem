package com.tracker.loggingtrackingservice.G.V1.WebClient;

import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class VehicleWebClientService {

    private final WebClient vehicleWebClient;


    public VehicleWebClientService(WebClient vehicleWebClient) {
        this.vehicleWebClient = vehicleWebClient;
    }



    public Mono<Map<String, Object>> sendDispatchCompletedMessage(UtilRecords.DispatchEndedDTO event) {
        return vehicleWebClient.post()
                .uri("/internal/vehicle/dispatch-completed/logs-service")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(event)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }


    public Mono<Map<String, Object>> sendTrackingInitializationMessage(UtilRecords.StartTrackingDTO event) {
        return vehicleWebClient.post()
                .uri("/internal/vehicle/track-start")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(event)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }


    public Mono<Map<String, Object>> sendCheckPoint(UtilRecords.vehicleLocationUpdate event) {
        return vehicleWebClient.post()
                .uri("/internal/vehicle/vehicle-location-update")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(event)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }
}
