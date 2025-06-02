package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class RabbitMqSenderService {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqSenderService.class);
    private final RabbitTemplate rabbitTemplate;

    public RabbitMqSenderService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }


    private static final String COMPLETED_DISPATCH_FANOUT_EXCHANGE = "completed.dispatch.fanOut.provider.logs";

    private static final String DISPATCH_TRACKING_FANOUT_EXCHANGE = "start.tracking.fanOut.provider.logs";


    // Send event to completed dispatch exchange
    public void sendCompletedDispatchFanOut(UtilRecords.DispatchEndedDTO completedEvent) {
        try {
            logger.info("Sending completed dispatch event rom the logs ofc: {}", completedEvent);
            rabbitTemplate.convertAndSend(
                    COMPLETED_DISPATCH_FANOUT_EXCHANGE, // exchange
                    "",                          // routing key (empty for fanout)
                    completedEvent               // message
            );
        } catch (Exception e) {
            logger.error("Failed to send dispatch completed event: {}", e.getMessage());
            throw new RuntimeException("Failed to send dispatch completed event", e);
        }
    }


    public void sendTrackingInitializationFanout(UtilRecords.StartTrackingDTO trackingDTO) {
        try {
            logger.info("Sending intialized tracking dispatch event rom the logs ofc: {}", trackingDTO);
            rabbitTemplate.convertAndSend(
                    DISPATCH_TRACKING_FANOUT_EXCHANGE, // exchange
                    "",                          // routing key (empty for fanout)
                    trackingDTO               // message
            );
        } catch (Exception e) {
            logger.error("Failed to send dispatch completed event: {}", e.getMessage());
            throw new RuntimeException("Failed to send dispatch completed event", e);
        }
    }
}
