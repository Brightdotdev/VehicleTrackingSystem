package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class RabbitMqSenderService {

    // Exchange name (not queue!)
    private static final String COMPLETED_DISPATCH_EXCHANGE = "completed.dispatch.fanOut";

    // Logger setup
    private static final Logger logger = LoggerFactory.getLogger(RabbitMqSenderService.class);
    private final RabbitTemplate rabbitTemplate;

    public RabbitMqSenderService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    // Send event to completed dispatch exchange
    public void sendCompletedDispatchFanOut(UtilRecords.DispatchEndedDTO completedEvent) {
        try {
            logger.info("Sending completed dispatch event: {}", completedEvent);
            rabbitTemplate.convertAndSend(
                    COMPLETED_DISPATCH_EXCHANGE, // exchange
                    "",                          // routing key (empty for fanout)
                    completedEvent               // message
            );
        } catch (Exception e) {
            logger.error("Failed to send dispatch completed event: {}", e.getMessage());
            throw new RuntimeException("Failed to send dispatch completed event", e);
        }
    }
}
