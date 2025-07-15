package com.example.DispatchService.WebClient;
import com.example.DispatchService.Utils.UtilRecords;
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



    public Mono<Map<String, Object>> sendDispatchRequested(UtilRecords.dispatchRequestBodyDTO dispatchRequest) {
        return vehicleWebClient.post()
                .uri("/internal/vehicle/handle-dispatch-request")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(dispatchRequest)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }


    public Mono<Map<String, Object>> sendDispatchValidatedMessage(UtilRecords.ValidatedDispatch dispatchRequest) {
        return vehicleWebClient.post()
                .uri("/internal/vehicle/dispatch-validated")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(dispatchRequest)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }


    public Mono<Map<String, Object>> sendDispatchCompletedMessage(UtilRecords.DispatchEndedDTO dispatchRequest) {
        return vehicleWebClient.post()
                .uri("/internal/vehicle/dispatch-completed/dispatch-service")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(dispatchRequest)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }
}
