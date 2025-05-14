package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RabbitMqSenderService {

        private final String COMPLETE_DISPATCH_FAN_OUT_QUEUE = "completed.dispatch.fanOut";

        private final String LOGGER_BIDDING_KEY = "vehicle.service.key";


        private final Logger logger = LoggerFactory.getLogger(RabbitMqSenderService.class);
        private final RabbitTemplate rabbitTemplate;

        public RabbitMqSenderService(RabbitTemplate rabbitTemplate) {
            this.rabbitTemplate = rabbitTemplate;
        }


        public void sendCompletedDispatchFanOut(UtilRecords.DispatchCompletedEvent completedEvent) {
            try {
                rabbitTemplate.convertAndSend(COMPLETE_DISPATCH_FAN_OUT_QUEUE,
                        "",
                        completedEvent);

            } catch (Exception e) {
                logger.error("Failed to send dispatch created event: {}", e.getMessage());
                throw new RuntimeException("Failed to send dispatch created event", e);
            }
        }
    }


