package com.example.DispatchService.RabbitMq;

import com.example.DispatchService.Utils.UtilRecords;
import com.example.DispatchService.WebClient.VehicleWebClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RabbitMqSenderService {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqSenderService.class);
    private final RabbitTemplate rabbitTemplate;
    private final VehicleWebClientService vehicleWebClientService;
    private final ResponseMapperService responseMapperService;

    // === Exchange Names ===
    private static final String DISPATCH_CREATED_DIRECT_EXCHANGE = "dispatch.created.exchange";
    private static final String DISPATCH_CREATED_FANOUT = "dispatch.created.fanOut";
    private static final String DISPATCH_COMPLETED_FANOUT = "completed.dispatch.fanOut.provider.dispatch.service";
    private static final String DISPATCH_VALIDATED_FANOUT = "dispatch.validated.fanOut.provider.dispatch";

    // === Routing Keys ===
    private static final String DISPATCH_CREATED_DIRECT_EXCHANGE_KEY = "dispatch.created.key";

    public RabbitMqSenderService(RabbitTemplate rabbitTemplate, VehicleWebClientService vehicleWebClientService, ResponseMapperService responseMapperService) {
        this.rabbitTemplate = rabbitTemplate;
        this.vehicleWebClientService = vehicleWebClientService;
        this.responseMapperService = responseMapperService;
    }

    /**
     * ✅ Send a dispatch created event via a direct exchange.
     * Expects a response from the receiving service.
     */
    public Map<String, Object> sendDispatchCreatedEvent(UtilRecords.dispatchRequestBodyDTO event, String cookieValue) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("Attempted to send null or invalid dispatch request: {}", event);
            throw new IllegalArgumentException("Invalid dispatch event — missing VIN");
        }

        try {
            /*@SuppressWarnings("unchecked")
            Object  rawResponse = rabbitTemplate.convertSendAndReceive(
                    DISPATCH_CREATED_DIRECT_EXCHANGE,
                    DISPATCH_CREATED_DIRECT_EXCHANGE_KEY,
                    event
            );

*/

          Object rawResponse = vehicleWebClientService.createNewWebClientDispatch(event,cookieValue).block();

          return  responseMapperService.dispatchMapper(rawResponse);

  /*          if (rawResponse == null) {
                logger.error("No response received from vehicle service for event: {}", event);

            }

            logger.info("Received response from vehicle service: {}", rawResponse);

            if (rawResponse instanceof Map<?, ?> mapResponse) {
                logger.info("Received valid Map response from vehicle service: {}", mapResponse);
                return mapResponse;
            } else if (rawResponse instanceof List<?> list) {
                logger.error("Expected Map but received List: {}", list);
                // fallback to HTTP anyway
            } else {
                logger.error("Unexpected response type from vehicle service: {}", rawResponse.getClass());
            }
  */

        } catch (Exception e) {
            logger.error("Failed to send dispatch created event: {}", e.getMessage(), e);
            throw new RuntimeException("Dispatch creation failed", e);
        }
    }

    /**
     * ✅ Send a fanout dispatch created event without expecting a response.
     */
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
