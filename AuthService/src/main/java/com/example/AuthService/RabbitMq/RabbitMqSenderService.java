package com.example.AuthService.RabbitMq;

import com.example.AuthService.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RabbitMqSenderService {


    // -- Stuff --
    private static final Logger logger = LoggerFactory.getLogger(RabbitMqSenderService.class);
    private final RabbitTemplate rabbitTemplate;


    // === exchanges and stuff ===

    private final String ADMIN_CREATED_DIRECT_EXCHANGE = "admin.created.exchange";

    // -- Routing keys --

    private final String ADMIN_CREATED_DIRECT_EXCHANGE_KEY = "admin.created.key";




    public RabbitMqSenderService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * ✅ Sends a new created admin
     */
    public Map<String, Object> sendAdminCreated(UtilRecords.adminCreatedRequestBodyDto event) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object>     response = (Map<String, Object>) rabbitTemplate.convertSendAndReceive(
                    ADMIN_CREATED_DIRECT_EXCHANGE,
                    ADMIN_CREATED_DIRECT_EXCHANGE_KEY,
                    event
            );

            if (response == null) {
                throw new RuntimeException("No response received from the logs service");
            }

            return response;
        } catch (Exception e) {
            logger.error("Failed to send dispatch created event: {}", e.getMessage());
            throw new RuntimeException("Failed to send dispatch created event", e);
        }
    }


}
