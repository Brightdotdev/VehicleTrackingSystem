package com.tracker.loggingtrackingservice.G.V1.WebClient;

import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;

@Service
public class DispatchServiceWebClient {

    private final WebClient dispatchWebClient;

    public DispatchServiceWebClient(WebClient dispatchWebClient) {
        this.dispatchWebClient = dispatchWebClient;
    }




    public Mono<Map<String, Object>> sendDispatchCompletedMessage(UtilRecords.DispatchEndedDTO event) {
        return dispatchWebClient.post()
                .uri("/internal/dispatch/complete")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(event)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }



    public Mono<Map<String, Object>> sendTrackingInitializationMessage(UtilRecords.StartTrackingDTO dispatchRequest) {
        return dispatchWebClient.post()
                .uri("/internal/dispatch/track/start")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(dispatchRequest)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }

}
