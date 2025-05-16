package com.example.DispatchService.RabbitMq;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    // === Fanout Exchanges ===
    private final String DISPATCH_CREATED_FANOUT = "dispatch.created.fanOut";
    private final String DISPATCH_VALIDATED_FANOUT = "dispatch.validated.fanOut";
    private final String DISPATCH_COMPLETED_FANOUT = "completed.dispatch.fanOut";  // renamed for consistency

    // === Fanout Queues ===
    private final String CREATED_LOG_QUEUE = "created.dispatch.fanout.log.queue";
    private final String VALIDATED_LOG_QUEUE = "dispatch.validated.queue.service.logs";
    private final String VALIDATED_VEHICLE_QUEUE = "dispatch.validated.queue.service.vehicle";
    private final String COMPLETED_LOG_QUEUE = "completed.dispatch.service.dispatch.fanOut";
    private final String COMPLETED_VEHICLE_QUEUE = "completed.dispatch.service.vehicle.fanOut";

    // === Direct Exchange ===
    private final String DISPATCH_DIRECT_EXCHANGE = "dispatch.created.exchange";

    // ---------- Exchanges ----------
    @Bean
    public DirectExchange dispatchDirectExchange() {
        return new DirectExchange(DISPATCH_DIRECT_EXCHANGE);
    }

    @Bean
    public FanoutExchange dispatchCreatedFanOut() {
        return new FanoutExchange(DISPATCH_CREATED_FANOUT);
    }

    @Bean
    public FanoutExchange dispatchValidatedFanOut() {
        return new FanoutExchange(DISPATCH_VALIDATED_FANOUT);
    }

    @Bean
    public FanoutExchange dispatchCompletedFanOut() {
        return new FanoutExchange(DISPATCH_COMPLETED_FANOUT);
    }

    // ---------- Queues ----------
    @Bean public Queue createdLogQueue() { return new Queue(CREATED_LOG_QUEUE); }
    @Bean public Queue validatedLogQueue() { return new Queue(VALIDATED_LOG_QUEUE); }
    @Bean public Queue validatedVehicleQueue() { return new Queue(VALIDATED_VEHICLE_QUEUE); }
    @Bean public Queue completedLogQueue() { return new Queue(COMPLETED_LOG_QUEUE); }
    @Bean public Queue completedVehicleQueue() { return new Queue(COMPLETED_VEHICLE_QUEUE); }

    // ---------- Bindings ----------
    @Bean public Binding createdLogBinding() {
        return BindingBuilder.bind(createdLogQueue()).to(dispatchCreatedFanOut());
    }

    @Bean public Binding validatedLogBinding() {
        return BindingBuilder.bind(validatedLogQueue()).to(dispatchValidatedFanOut());
    }

    @Bean public Binding validatedVehicleBinding() {
        return BindingBuilder.bind(validatedVehicleQueue()).to(dispatchValidatedFanOut());
    }

    @Bean public Binding completedLogBinding() {
        return BindingBuilder.bind(completedLogQueue()).to(dispatchCompletedFanOut());
    }

    @Bean public Binding completedVehicleBinding() {
        return BindingBuilder.bind(completedVehicleQueue()).to(dispatchCompletedFanOut());
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
