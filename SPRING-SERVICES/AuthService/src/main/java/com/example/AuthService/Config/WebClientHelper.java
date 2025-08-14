package com.example.AuthService.Config;

import com.example.AuthService.Utils.ApiResponse;
import com.example.AuthService.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;



@Component
public class WebClientHelper {

    private static final Logger logger = LoggerFactory.getLogger(WebClientHelper.class);


    /**
     * Executes a WebClient call safely, returning an ApiResponse with proper type information.
     * - Returns ApiResponse.ok() if the body is null
     * - Returns ApiResponse.success() if body is present
     * - Catches WebClientResponseException for HTTP errors and maps them to ApiResponse.error()
     * - Catches any other exception as a 500 error
     */
    public <T> ApiResponse<T> safeCall(Mono<T> requestMono) {
        return requestMono
                .map(body -> {
                    if (body == null) {
                        // Response body is empty but request succeeded
                        return ApiResponse.<T>ok(200, "Request completed successfully");
                    }
                    // Successful response with data
                    return ApiResponse.success(200, "Request completed successfully", body);
                })
                .onErrorResume(WebClientResponseException.class, ex ->
                        Mono.just(ApiResponse.<T>error(
                                ex.getStatusCode().value(),
                                ex.getResponseBodyAsString()
                        ))
                )
                .onErrorResume(Exception.class, ex ->
                        Mono.just(ApiResponse.<T>error(
                                500,
                                "Unexpected error: " + ex.getMessage()
                        ))
                )
                .block();
    }
}
