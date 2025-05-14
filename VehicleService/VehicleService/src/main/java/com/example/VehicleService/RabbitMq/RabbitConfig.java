package com.example.VehicleService.RabbitMq;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;


@Configuration
public class RabbitConfig {

    private final String VEHICLE_QUEUE = "vehicle.service.created.dispatch.queue";
    private final String DISPATCH_DIRECT_EXCHANGE = "dispatch.created.exchange";
    private final String VEHICLE_BIDING_KEY = "dispatch.created.key";

    @Bean
    public Queue vehicleDispatchQueue() {
        return new Queue(VEHICLE_QUEUE, true);
    }

    @Bean
    public DirectExchange dispatchDirectExchange() {
        return new DirectExchange(DISPATCH_DIRECT_EXCHANGE);
    }


    // Bind queue to exchange with routing key
    @Bean
    public Binding dispatchBinding(Queue vehicleDispatchQueue, DirectExchange dispatchDirectExchange) {
        return BindingBuilder.bind(vehicleDispatchQueue)
                .to(dispatchDirectExchange)
                .with(VEHICLE_BIDING_KEY);
    }
    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }


    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jackson2JsonMessageConverter());
        return template;
    }

}
