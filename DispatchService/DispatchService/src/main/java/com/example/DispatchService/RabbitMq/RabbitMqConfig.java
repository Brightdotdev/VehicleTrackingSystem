package com.example.DispatchService.RabbitMq;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;


@Configuration
public class RabbitMqConfig {

    private final String CREATED_DISPATCH_FAN_OUT_QUEUE = "created.dispatch.log.queue";


    private final String DISPATCH_CREATED_FAN_OUT_EXCHANGE = "dispatch.created.fanOut";
    private final String DISPATCH_DIRECT_EXCHANGE = "dispatch.created.exchange";

    private final String DISPATCH_VALIDATED_FAN_OUT_EXCHANGE = "dispatch.validated.fanOut";

    private final String DISPATCH_VALIDATED_FAN_OUT_QUEUE_LOGS = "dispatch.validated.queue.service.logs";
    private final String DISPATCH_VALIDATED_FAN_OUT_QUEUE_VEHICLE = "dispatch.validated.queue.service.vehicle";


    // direct exchange response to the vehicle service
    @Bean
    public DirectExchange dispatchDirectExchange() {
        return new DirectExchange(DISPATCH_DIRECT_EXCHANGE);
    }



    // fan-out exchange for  a validated dispatch event
    @Bean
    public FanoutExchange validatedDispatchFanOut() {
        return new FanoutExchange(DISPATCH_VALIDATED_FAN_OUT_EXCHANGE);
    }

    @Bean
    public Queue logValidatedQueue() {
        return new Queue(DISPATCH_VALIDATED_FAN_OUT_QUEUE_LOGS);
    }

    @Bean
    public Binding logValidatedBinding(Queue logValidatedQueue, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(logValidatedQueue).to(fanoutExchange);
    }

    @Bean
    public Queue vehicleValidatedQueue() {
        return new Queue(DISPATCH_VALIDATED_FAN_OUT_QUEUE_VEHICLE);
    }

    @Bean
    public Binding vehicleValidatedBinding(Queue vehicleValidatedQueue, FanoutExchange validatedDispatchFanOut) {
        return BindingBuilder.bind(vehicleValidatedQueue).to(validatedDispatchFanOut);
    }


    // fan-out exchange for a new created dispatch event
    @Bean
    public FanoutExchange fanoutExchange() {
        return new FanoutExchange(DISPATCH_CREATED_FAN_OUT_EXCHANGE);
    }

    @Bean
    public Queue logQueue() {
        return new Queue(CREATED_DISPATCH_FAN_OUT_QUEUE);
    }

    @Bean
    public Binding logBinding(Queue logQueue, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(logQueue).to(fanoutExchange);
    }

    // Normal config
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
