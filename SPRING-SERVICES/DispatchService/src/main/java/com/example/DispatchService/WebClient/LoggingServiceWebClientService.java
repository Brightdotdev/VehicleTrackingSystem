package com.example.DispatchService.WebClient;

import com.example.DispatchService.Utils.UtilRecords;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;


@Service
public class LoggingServiceWebClientService {



    private final WebClient loggingWebClient;


    public LoggingServiceWebClientService(WebClient loggingWebClient) {
        this.loggingWebClient = loggingWebClient;
    }



    public Mono<Map<String, Object>> notifyDispatchCreated(UtilRecords.dispatchRequestBodyDTO dispatchRequest) {
        return loggingWebClient.post()
                .uri("/internal/logs/dispatch-created")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(dispatchRequest)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }

    public Mono<Map<String, Object>> sendDispatchCompletedNotif(UtilRecords.DispatchEndedDTO dispatchRequest) {
        return loggingWebClient.post()
                .uri("/internal/logs/dispatch-completed")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(dispatchRequest)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }



    public Mono<Map<String, Object>> sendDispatchValidatedNotif(UtilRecords.ValidatedDispatch dispatchRequest) {
        return loggingWebClient.post()
                .uri("/internal/logs/dispatch-validated")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(dispatchRequest)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }

}
