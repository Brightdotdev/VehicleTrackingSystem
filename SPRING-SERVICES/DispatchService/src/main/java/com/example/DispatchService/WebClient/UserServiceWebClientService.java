package com.example.DispatchService.WebClient;

import com.example.DispatchService.Utils.UtilRecords;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;


@Service
public class UserServiceWebClientService {



    private final WebClient userWebClient;


    public UserServiceWebClientService(WebClient userWebClient) {
        this.userWebClient = userWebClient;
    }



    public Mono<Map<String, Object>> updateUserDispatchScore(UtilRecords.DispatchScoreUpdateDto scoreUpdate) {
        return userWebClient.post()
                .uri("/internal/auth/dispatch/update-score")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(scoreUpdate)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<>() {});
    }

}
