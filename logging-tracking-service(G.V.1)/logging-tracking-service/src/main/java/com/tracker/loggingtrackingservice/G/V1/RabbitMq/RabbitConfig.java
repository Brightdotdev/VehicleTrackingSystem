package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {


    // -- created dispatch fanout exchange

    private static final String DISPATCH_CREATED_FANOUT = "dispatch.created.fanOut";


    private static final String DISPATCH_CREATED_FANOUT_LOG_QUEUE = "log.service.dispatch.created.fanout.queue";


    @Bean
    public FanoutExchange createdDispatchFanoutExchange() {
        return new FanoutExchange(DISPATCH_CREATED_FANOUT, true, false);
    }

    @Bean
    public Queue createdDispatchFanoutQueue() {
        return new Queue(DISPATCH_CREATED_FANOUT_LOG_QUEUE, true, false, false);
    }


    @Bean
    public Binding createdDispatchLogQueueBinding(FanoutExchange createdDispatchFanoutExchange,Queue createdDispatchFanoutQueue) {
        return BindingBuilder.bind(createdDispatchFanoutQueue)
                .to(createdDispatchFanoutExchange);
    }




    // === dispatch completed from dispatch service ===

    private final String DISPATCH_COMPLETED_FANOUT = "completed.dispatch.fanOut.provider.dispatch.service";

    private final String DISPATCH_COMPLETED_FANOUT_LOGS_QUEUE = "completed.dispatch.fanOut.provider.dispatch.service.queue.logs.service";

    @Bean
    public FanoutExchange completedDispatchFanoutFromDispatchService() {
        return new FanoutExchange(DISPATCH_COMPLETED_FANOUT);
    }

    @Bean
    public Queue completedDispatchFanoutFromDispatchServiceQueue() {
        return new Queue(DISPATCH_COMPLETED_FANOUT_LOGS_QUEUE ,true, false, false);
    }

    @Bean
    public Binding completedDispatchFromDispatchServiceBinding(FanoutExchange completedDispatchFanoutFromDispatchService,Queue completedDispatchFanoutFromDispatchServiceQueue) {
        return BindingBuilder.bind(completedDispatchFanoutFromDispatchServiceQueue)
                .to(completedDispatchFanoutFromDispatchService);
    }



    // === dispatch validated from dispatch service ===

    private final String DISPATCH_VALIDATED_FANOUT = "dispatch.validated.fanOut.provider.dispatch";

    private final String DISPATCH_VALIDATED_FANOUT_LOGS_QUEUE = "validated.dispatch.fanOut.provider.dispatch.service.queue.logs.service";

    @Bean
    public FanoutExchange validatedDispatchFromDispatchService() {
        return new FanoutExchange(DISPATCH_VALIDATED_FANOUT,  true, false);
    }

    @Bean
    public Queue validatedDispatchFromDispatchServiceQueue() {
        return new Queue(DISPATCH_VALIDATED_FANOUT_LOGS_QUEUE, true, false, false);
    }

    @Bean
    public Binding validatedDispatchFromDispatchServiceBinding(FanoutExchange validatedDispatchFromDispatchService , Queue validatedDispatchFromDispatchServiceQueue) {
        return BindingBuilder.bind(validatedDispatchFromDispatchServiceQueue)
                .to(validatedDispatchFromDispatchService);
    }



    // ==== Normal config ===

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
