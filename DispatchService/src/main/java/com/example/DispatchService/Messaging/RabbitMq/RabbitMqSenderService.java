package com.example.DispatchService.Messaging.RabbitMq;


import com.example.DispatchService.Messaging.MessagingService;
import com.example.DispatchService.Messaging.ResponseMapperService;
import com.example.DispatchService.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import java.util.Map;


@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "rabbitMq")
public class RabbitMqSenderService implements MessagingService {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqSenderService.class);
    private final RabbitTemplate rabbitTemplate;
    private final ResponseMapperService responseMapperService;


    // === Exchange Names ===
    private static final String DISPATCH_CREATED_DIRECT_EXCHANGE = "dispatch.created.exchange";
    private static final String DISPATCH_CREATED_FANOUT = "dispatch.created.fanOut";
    private static final String DISPATCH_COMPLETED_FANOUT = "completed.dispatch.fanOut.provider.dispatch.service";
    private static final String DISPATCH_VALIDATED_FANOUT = "dispatch.validated.fanOut.provider.dispatch";

    // === Routing Keys ===
    private static final String DISPATCH_CREATED_DIRECT_EXCHANGE_KEY = "dispatch.created.key";



    public RabbitMqSenderService(RabbitTemplate rabbitTemplate, RabbitMqResponseMapper rabbitMqResponseMapper, ResponseMapperService responseMapperService) {
        this.rabbitTemplate = rabbitTemplate;
        this.responseMapperService = responseMapperService;
    }


    /**
     * ✅ Send a dispatch created event via a direct exchange.
     * Expects a response from the receiving service.
     */
    @Override
    public Map<String, Object> sendDispatchRequestedEvent(UtilRecords.dispatchRequestBodyDTO event) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("Attempted to send null or invalid dispatch request: {}", event);
            throw new IllegalArgumentException("Invalid dispatch event — missing VIN");
        }

        try {
            Object  rawResponse = rabbitTemplate.convertSendAndReceive(
                    DISPATCH_CREATED_DIRECT_EXCHANGE,
                    DISPATCH_CREATED_DIRECT_EXCHANGE_KEY,
                    event
            );

            if (rawResponse == null) {
                logger.error("No response received from vehicle service for event: {}", event);
            }
          return  responseMapperService.dispatchRequestMapper(rawResponse);
        } catch (Exception e) {
            logger.error("Failed to send dispatch created event: {}", e.getMessage(), e);
            throw new RuntimeException("Dispatch creation failed", e);
        }
    }



    /**
     * ✅ Send a fanout dispatch created event without expecting a response.
     */
    @Override
    public void sendDispatchCreatedEventNoResponse(UtilRecords.dispatchRequestBodyDTO event) {
        if (event == null) {
            logger.warn("Attempted to fanout null dispatch creation event");
            return;
        }

        try {
            rabbitTemplate.convertAndSend(DISPATCH_CREATED_FANOUT, "", event);
            logger.info("Dispatched created event sent via fanout: {}", event);
        } catch (Exception e) {
            logger.error("Failed to fanout dispatch created event: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send fanout dispatch created event", e);
        }
    }

    /**
     * ✅ Send a dispatch completed/cancelled event via fanout.
     */
    @Override
    public void sendDispatchCompletedFanoutFromDispatchService(UtilRecords.DispatchEndedDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Attempted to send invalid dispatch completed event: {}", event);
            return;
        }

        try {
            rabbitTemplate.convertAndSend(DISPATCH_COMPLETED_FANOUT, "", event);
            logger.info("Dispatch completed event sent: {}", event);
        } catch (Exception e) {
            logger.error("Failed to send dispatch completed event: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send dispatch completed event", e);
        }
    }

    /**
     * ✅ Broadcast a validated dispatch via fanout exchange.
     */
    @Override
    public void sendDispatchValidatedNoResponse(UtilRecords.ValidatedDispatch event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Attempted to send invalid validated dispatch event: {}", event);
            return;
        }

        try {
            rabbitTemplate.convertAndSend(DISPATCH_VALIDATED_FANOUT, "", event);
            logger.info("Validated dispatch event sent: {}", event);
        } catch (Exception e) {
            logger.error("Failed to send validated dispatch event: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send dispatch validated event", e);
        }
    }
}
