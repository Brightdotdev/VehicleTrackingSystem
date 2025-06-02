package com.example.VehicleService.RabbitMq;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    /***  Receiver config   **/

    // === Dispatch created direct exchange ====

    private final String DISPATCH_CREATED_DIRECT_EXCHANGE = "dispatch.created.exchange";
    private final String DISPATCH_CREATED_DIRECT_EXCHANGE_KEY = "dispatch.created.key";
    private final String DISPATCH_CREATED_DIRECT_EXCHANGE_QUEUE = "vehicle.service.created.dispatch.queue";

    @Bean
    public Queue vehicleRequestedDispatchDirectExchangeQueue() {
        return new Queue(DISPATCH_CREATED_DIRECT_EXCHANGE_QUEUE, true,false,false);
    }

    @Bean
    public DirectExchange vehicleRequestedDispatchDirectExchange() {
        return new DirectExchange(DISPATCH_CREATED_DIRECT_EXCHANGE);
    }

    @Bean
    public Binding vehicleRequestedDispatchDirectExchangeBinding(DirectExchange vehicleRequestedDispatchDirectExchange,
                                   Queue vehicleRequestedDispatchDirectExchangeQueue) {
        return BindingBuilder.bind(vehicleRequestedDispatchDirectExchangeQueue).to(vehicleRequestedDispatchDirectExchange).with(DISPATCH_CREATED_DIRECT_EXCHANGE_KEY);
    }

    // === dispatch completed from dispatch service ===

    private final String DISPATCH_COMPLETED_FANOUT = "completed.dispatch.fanOut.provider.dispatch.service";

    private final String DISPATCH_COMPLETED_FANOUT_VEHICLE_QUEUE = "completed.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service";

    @Bean
    public FanoutExchange completedDispatchFanoutFromDispatchService() {
        return new FanoutExchange(DISPATCH_COMPLETED_FANOUT,  true, false);
    }

    @Bean
    public Queue completedDispatchFanoutFromDispatchServiceQueue() {
        return new Queue(DISPATCH_COMPLETED_FANOUT_VEHICLE_QUEUE, true, false, false);
    }

    @Bean
    public Binding completedDispatchFromDispatchServiceBinding(FanoutExchange completedDispatchFanoutFromDispatchService,Queue completedDispatchFanoutFromDispatchServiceQueue) {
        return BindingBuilder.bind(completedDispatchFanoutFromDispatchServiceQueue)
                .to(completedDispatchFanoutFromDispatchService);
    }

 // === dispatch validated from dispatch service ===

    private final String DISPATCH_VALIDATED_FANOUT = "dispatch.validated.fanOut.provider.dispatch";

    private final String DISPATCH_VALIDATED_FANOUT_VEHICLE_QUEUE = "validated.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service";

    @Bean
    public FanoutExchange validatedDispatchFromDispatchService() {
        return new FanoutExchange(DISPATCH_VALIDATED_FANOUT,  true, false);
    }

    @Bean
    public Queue validatedDispatchFromDispatchServiceQueue() {
        return new Queue(DISPATCH_VALIDATED_FANOUT_VEHICLE_QUEUE, true, false, false);
    }

    @Bean
    public Binding validatedDispatchFromDispatchServiceBinding(FanoutExchange validatedDispatchFromDispatchService , Queue validatedDispatchFromDispatchServiceQueue) {
        return BindingBuilder.bind(validatedDispatchFromDispatchServiceQueue)
                .to(validatedDispatchFromDispatchService);
    }


    // === dispatch validated from logs service ===

    private final String DISPATCH_COMPLETED_FROM_LOGS = "completed.dispatch.fanOut.provider.logs";

    private final String DISPATCH_COMPLETED_FROM_LOGS_QUEUE = "completed.dispatch.fanOut.provider.logs.queue.service.vehicle";

    @Bean
    public FanoutExchange completedDispatchFromLogs() {
        return new FanoutExchange(DISPATCH_COMPLETED_FROM_LOGS,  true, false);
    }

    @Bean
    public Queue completedDispatchFromLogsQueue() {
        return new Queue(DISPATCH_COMPLETED_FROM_LOGS_QUEUE, true, false, false);
    }

    @Bean
    public Binding completedDispatchFromLogsBonding(FanoutExchange completedDispatchFromLogs , Queue completedDispatchFromLogsQueue) {
        return BindingBuilder.bind(completedDispatchFromLogsQueue)
                .to(completedDispatchFromLogs);
    }


    // === start tracking from logs service ===

    private static final String DISPATCH_TRACKING_FANOUT_EXCHANGE_FOR_RECEIVING = "start.tracking.fanOut.provider.logs";

    private final String DISPATCH_TRACKING_FANOUT_EXCHANGE_FOR_RECEIVING_LOGS_QUEUE = "start.tracking.fanOut.provider.logs.queue.vehicle";

    @Bean
    public FanoutExchange startTrackingFromTrackingService() {
        return new FanoutExchange(DISPATCH_TRACKING_FANOUT_EXCHANGE_FOR_RECEIVING);
    }

    @Bean
    public Queue startTrackingFromTrackingServiceQueue() {
        return new Queue(DISPATCH_TRACKING_FANOUT_EXCHANGE_FOR_RECEIVING_LOGS_QUEUE ,true, false, false);
    }

    @Bean
    public Binding startTrackingFromTrackingServiceBinding(FanoutExchange startTrackingFromTrackingService,Queue startTrackingFromTrackingServiceQueue) {
        return BindingBuilder.bind(startTrackingFromTrackingServiceQueue)
                .to(startTrackingFromTrackingService);
    }

    // === normal config ===

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
