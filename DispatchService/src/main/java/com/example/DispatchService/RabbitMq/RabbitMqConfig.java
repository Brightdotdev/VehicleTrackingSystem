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

    /**  Sender config   **/

    // === Direct Exchange ===
    private final String DISPATCH_DIRECT_EXCHANGE = "dispatch.created.exchange";


    @Bean
    public DirectExchange dispatchCreatedDirectExchange() {
        return new DirectExchange(DISPATCH_DIRECT_EXCHANGE,  true, false);
    }


    // ---------- Dispatch created fanout ----------

    private final String DISPATCH_CREATED_FANOUT = "dispatch.created.fanOut";

    @Bean
    public FanoutExchange dispatchCreatedNoResponseFanOut() {
        return new FanoutExchange(DISPATCH_CREATED_FANOUT, true, false);
    }


    // ==== Validated dispatch fanout  ====

    private final String DISPATCH_VALIDATED_FANOUT = "dispatch.validated.fanOut.provider.dispatch";
    @Bean
    public FanoutExchange dispatchValidatedFanOutFromDispatchService() {
        return new FanoutExchange(DISPATCH_VALIDATED_FANOUT, true, false);
    }


    //  === dispatch completed fanout ===

    private final String DISPATCH_COMPLETED_FANOUT = "completed.dispatch.fanOut.provider.dispatch.service";

    @Bean
    public FanoutExchange dispatchCompletedFanOutFromDispatchService() {
        return new FanoutExchange(DISPATCH_COMPLETED_FANOUT, true, false);
    }


    /**  Receiver config   **/


    // === dispatch validated from logs service ===

    private final String DISPATCH_COMPLETED_FROM_LOGS = "completed.dispatch.fanOut.provider.logs";

    private final String DISPATCH_COMPLETED_FROM_LOGS_QUEUE = "completed.dispatch.fanOut.provider.logs.queue.service.dispatch";

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

    private final String DISPATCH_TRACKING_FANOUT_EXCHANGE_FOR_RECEIVING_LOGS_QUEUE = "start.tracking.fanOut.provider.logs.queue.dispatch";

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

 /** Normal config **/


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
