package com.example.AuthService.Config;

import com.example.AuthService.Utils.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

public class WebClientHelper {

    private static final Logger logger = LoggerFactory.getLogger(WebClientHelper.class);

    private final WebClient webClient;

    /**
     * Constructor injecting a configured WebClient instance.
     * @param webClient Spring WebClient instance with base URL and config set
     */
    public WebClientHelper(WebClient webClient) {
        this.webClient = webClient;
    }

    /**
     * Generic POST helper method to send a request body and parse the response into the specified type.
     *
     * @param <T> Response type
     * @param uri Endpoint URI (relative)
     * @param requestBody Body to POST
     * @param responseType Reference for deserializing the response body
     * @return Mono wrapping the parsed ApiResponse<T>
     */
    public <T> Mono<ApiResponse<T>> post(String uri, Object requestBody, ParameterizedTypeReference<ApiResponse<T>> responseType) {
        return webClient.post()
                .uri(uri)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(responseType)
                .doOnSuccess(response -> logger.info("POST {} succeeded with response: {}", uri, response))
                .doOnError(error -> {
                    if (error instanceof WebClientResponseException e) {
                        logger.error("POST {} failed with status code {} and body {}", uri, e.getRawStatusCode(), e.getResponseBodyAsString());
                    } else {
                        logger.error("POST {} failed with error: {}", uri, error.getMessage());
                    }
                })
                .onErrorResume(error -> {
                    // Return a fallback error ApiResponse with useful info to caller
                    String errorMsg = "Request to " + uri + " failed: " + error.getMessage();
                    logger.error(errorMsg, error);
                    return Mono.just(ApiResponse.error(500, errorMsg));
                });
    }

    /**
     * Generic GET helper method to retrieve data from an endpoint and parse response.
     *
     * @param <T> Response type
     * @param uri Endpoint URI (relative)
     * @param responseType Reference for deserializing the response body
     * @return Mono wrapping the parsed ApiResponse<T>
     */
    public <T> Mono<ApiResponse<T>> get(String uri, ParameterizedTypeReference<ApiResponse<T>> responseType) {
        return webClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(responseType)
                .doOnSuccess(response -> logger.info("GET {} succeeded with response: {}", uri, response))
                .doOnError(error -> {
                    if (error instanceof WebClientResponseException e) {
                        logger.error("GET {} failed with status code {} and body {}", uri, e.getRawStatusCode(), e.getResponseBodyAsString());
                    } else {
                        logger.error("GET {} failed with error: {}", uri, error.getMessage());
                    }
                })
                .onErrorResume(error -> {
                    String errorMsg = "Request to " + uri + " failed: " + error.getMessage();
                    logger.error(errorMsg, error);
                    return Mono.just(ApiResponse.error(500, errorMsg));
                });
    }
}
