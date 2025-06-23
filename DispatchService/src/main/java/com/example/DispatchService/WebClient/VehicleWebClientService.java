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

    // Constructor injection
    public VehicleWebClientService(WebClient vehicleWebClient) {
        this.vehicleWebClient = vehicleWebClient;
    }

    public Mono<Map<String, Object>> getVehicleByVin(String vin) {
        return vehicleWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/vehicles/{vin}")
                        .build(vin))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }


    public Mono<Map<String, Object>> createNewWebClientDispatch(UtilRecords.dispatchRequestBodyDTO dispatchRequest) {
        return vehicleWebClient.post()
                .uri("/v1/user/vehicle/handle-new-dispatch")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(dispatchRequest)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }
}
