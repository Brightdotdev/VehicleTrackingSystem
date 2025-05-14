package com.example.DispatchService.RabbitMq;

import com.example.DispatchService.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
public class RabbitMqSenderService {

    private final String DISPATCH_DIRECT_EXCHANGE = "dispatch.created.exchange";
    private final String DISPATCH_CREATED_FAN_OUT_EXCHANGE = "dispatch.created.fanOut";

    private final String VEHICLE_BIDING_KEY = "dispatch.created.key";



    private final Logger logger = LoggerFactory.getLogger(RabbitMqSenderService.class);

    private final RabbitTemplate rabbitTemplate;

    public RabbitMqSenderService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }


    public  Map<String, Object>  sendDispatchCreatedEvent(UtilRecords.dispatchRequestBody event) {

        try {

            Map<String, Object> response = (Map<String, Object>)
                rabbitTemplate.convertSendAndReceive(
                DISPATCH_DIRECT_EXCHANGE,
                    VEHICLE_BIDING_KEY,
                        event
            );

            if (response == null) {
                throw new RuntimeException("No response received from the vehicle service");
            }

            return response;

        } catch (Exception e) {
            logger.error("Failed to send dispatch created event: {}", e.getMessage());
            throw new RuntimeException("Failed to send dispatch created event", e);
        }
    }


    public void sendDispatchCreatedEventNoResponse(UtilRecords.dispatchRequestBody event) {

        try {

                    rabbitTemplate.convertAndSend(
                            DISPATCH_CREATED_FAN_OUT_EXCHANGE,
                            "",
                            event
                    );
        } catch (Exception e) {
            logger.error("Failed to send dispatch created event: {}", e.getMessage());
            throw new RuntimeException("Failed to send dispatch created event", e);
        }
    }
}
