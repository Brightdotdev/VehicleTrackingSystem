package com.example.AuthService.RabbitMq;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {


    // === admin created Direct Exchange ===
    private final String ADMIN_CREATED_DIRECT_EXCHANGE = "admin.created.exchange";
    @Bean
    public DirectExchange adminCreatedDirectExchange() {
        return new DirectExchange(ADMIN_CREATED_DIRECT_EXCHANGE,  true, false);
    }



    // ---------- Converter & Template ----------
    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jackson2JsonMessageConverter());
        template.setReplyTimeout(5000);
        return template;
    }
}
