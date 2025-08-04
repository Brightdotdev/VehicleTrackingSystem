package com.example.VehicleService.Messaging.WebClient;

import com.example.VehicleService.Config.AuthProperties;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
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
    public WebClient dispatchWebClient(
            @Value("${external.services.dispatch.base-url}") String baseUrl) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("X-Internal-API-Key", authProperties.getApi().getKey())
                .build();
    }

}
