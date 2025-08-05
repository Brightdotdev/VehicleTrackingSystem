package com.example.DispatchService.Messaging.WebClient;
import com.example.DispatchService.Config.AuthProperties;
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


    @Bean
    public WebClient userWebClient(
            @Value("${external.services.auth.base-url}") String baseUrl) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("X-Internal-API-Key", authProperties.getApi().getKey())
                .build();
    }

    @Bean
    public WebClient vehicleWebClient(
            @Value("${external.services.vehicle.base-url}") String baseUrl) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("X-Internal-API-Key", authProperties.getApi().getKey())
                .build();
    }

    @Bean
    public WebClient authWebClient(
            @Value("${external.services.auth.base-url}") String baseUrl) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("X-Internal-API-Key", authProperties.getApi().getKey())
                .build();
    }
}
