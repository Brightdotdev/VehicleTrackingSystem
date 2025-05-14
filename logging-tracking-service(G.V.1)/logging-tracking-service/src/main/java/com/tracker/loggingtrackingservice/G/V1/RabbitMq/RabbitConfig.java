package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Configuration
public class RabbitConfig {

    private final String FAN_OUT_QUEUE = "completed.dispatch.fanOut";

    private final String COMPELTED_DISPATCH_VEHICLE_QUEUE = "completed.dispatch.service.vehicle.fanOut";

    private final String COMPELTED_DISPATCH_DISPATCH_QUEUE = "completed.dispatch.service.dispatch.fanOut";




    // fan out exchange for completed dispatch

    @Bean
    public FanoutExchange fanoutExchange() {
        return new FanoutExchange(FAN_OUT_QUEUE);
    }


    @Bean
    public Queue vehicleQueue() {
        return new Queue(COMPELTED_DISPATCH_VEHICLE_QUEUE);
    }
    @Bean
    public Queue dispatchQueue() {
        return new Queue(COMPELTED_DISPATCH_DISPATCH_QUEUE);
    }

    @Bean
    public Binding vehicleBinding(Queue vehicleQueue, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(vehicleQueue).to(fanoutExchange);
    }

    @Bean
    public Binding dispatchBinding(Queue dispatchQueue, FanoutExchange fanoutExchange) {
        return BindingBuilder.bind(dispatchQueue).to(fanoutExchange);
    }




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
