package com.example.DispatchService.RabbitMq;

import com.example.DispatchService.Utils.UtilRecords;
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

    private static final String DISPATCH_CREATED_DIRECT_EXCHANGE = "dispatch.created.exchange";

    private static final String DISPATCH_CREATED_FANOUT = "dispatch.created.fanOut";

    private final String DISPATCH_COMPLETED_FANOUT = "completed.dispatch.fanOut.provider.dispatch.service";

    private final String DISPATCH_VALIDATED_FANOUT = "dispatch.validated.fanOut.provider.dispatch";


    // -- Routing keys --

    private static final String DISPATCH_CREATED_DIRECT_EXCHANGE_KEY = "dispatch.created.key";



    public RabbitMqSenderService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * ✅ Sends a dispatch event expecting a response using a direct exchange
     */
    public Map<String, Object> sendDispatchCreatedEvent(UtilRecords.dispatchRequestBodyDTO event) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object>     response = (Map<String, Object>) rabbitTemplate.convertSendAndReceive(
                    DISPATCH_CREATED_DIRECT_EXCHANGE,
                    DISPATCH_CREATED_DIRECT_EXCHANGE_KEY,
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

    /**
     * ✅ Fanout — dispatch created event sent without waiting for a response
     */

    public void sendDispatchCreatedEventNoResponse(UtilRecords.dispatchRequestBodyDTO event) {
        try {
            rabbitTemplate.convertAndSend(
                    DISPATCH_CREATED_FANOUT,
                    "",
                    event
            );
        } catch (Exception e) {
            logger.error("Failed to send dispatch created event that expects no response from the dispatch service: {}", e.getMessage());
            throw new RuntimeException("Failed to send dispatch created event", e);
        }
    }

    /**
     * ✅ Fanout — notify that a dispatch was either completed or cancelled
     */

    public void sendDispatchCompletedFanoutFromDispatchService(UtilRecords.DispatchEndedDTO event) {
        try {
            rabbitTemplate.convertAndSend(
                    DISPATCH_COMPLETED_FANOUT,
                    "",
                    event
            );
        } catch (Exception e) {
            logger.error("Failed to send dispatch completed event from the dispatch service: {}", e.getMessage());
            throw new RuntimeException("Failed to send dispatch event", e);
        }
    }

    /**
     * ✅ Fanout — broadcast validated dispatch event
     */
    public void sendDispatchValidatedNoResponse(UtilRecords.ValidatedDispatch dispatchValidatedBroadcast) {
        try {
            rabbitTemplate.convertAndSend(
                    DISPATCH_VALIDATED_FANOUT,
                    "",
                    dispatchValidatedBroadcast
            );
        } catch (Exception e) {
            logger.error("Failed to send dispatch VALIDATED event: {}", e.getMessage());
            throw new RuntimeException("Failed to send dispatch validated event", e);
        }
    }
}
