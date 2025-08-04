package com.example.AuthService.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {



    private final AuthProperties authProperties;

    public WebClientConfig(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    @Bean
    public WebClient loggingWebClient(
            @Value("${external.services.logging.base-url}") String baseUrl) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("X-Internal-API-Key", authProperties.getApi().getKey())
                .build();
    }
}
