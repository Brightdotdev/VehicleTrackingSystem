package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    private final String COMPLETED_DISPATCH_FANOUT = "completed.dispatch.fanOut";
    private final String COMPLETED_DISPATCH_LOG_QUEUE = "completed.dispatch.service.dispatch.fanOut";

    @Bean
    public FanoutExchange completedDispatchFanout() {
        return new FanoutExchange(COMPLETED_DISPATCH_FANOUT);
    }

    @Bean
    public Queue completedDispatchLogQueue() {
        return new Queue(COMPLETED_DISPATCH_LOG_QUEUE);
    }

    @Bean
    public Binding dispatchBinding() {
        return BindingBuilder.bind(completedDispatchLogQueue())
                .to(completedDispatchFanout());
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
