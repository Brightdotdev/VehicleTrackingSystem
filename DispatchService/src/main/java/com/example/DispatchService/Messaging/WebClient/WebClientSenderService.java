package com.example.DispatchService.Messaging.WebClient;

import com.example.DispatchService.Exceptions.ConflictException;
import com.example.DispatchService.Messaging.MessagingService;
import com.example.DispatchService.Messaging.ResponseMapperService;
import com.example.DispatchService.Utils.UtilRecords;
import com.example.DispatchService.WebClient.LoggingServiceWebClientService;
import com.example.DispatchService.WebClient.VehicleWebClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "webClient", matchIfMissing = true)
public class WebClientSenderService implements MessagingService {

    private static final Logger logger = LoggerFactory.getLogger(WebClientSenderService.class);

    private final VehicleWebClientService vehicleWebClientService;
    private final LoggingServiceWebClientService loggingServiceWebClientService;
    private final ResponseMapperService responseMapperService;


    public WebClientSenderService(VehicleWebClientService vehicleWebClientService, LoggingServiceWebClientService loggingServiceWebClientService, ResponseMapperService responseMapperService) {
        this.vehicleWebClientService = vehicleWebClientService;
        this.loggingServiceWebClientService = loggingServiceWebClientService;
        this.responseMapperService = responseMapperService;
    }

    /**
     * ✅ Send a dispatch created event via webclient http(s) directly
     * Expects a response from the receiving service.
     */
    @Override
    public Map<String, Object> sendDispatchRequestedEvent(UtilRecords.dispatchRequestBodyDTO event) {

        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("Attempted to send null or invalid dispatch request: {}", event);
            throw new IllegalArgumentException("Invalid dispatch event — missing VIN");
        }

        try {

          Object rawResponse = vehicleWebClientService.sendDispatchRequested(event).block();

            if (rawResponse == null) {
                logger.error("No response received from vehicle service for event: {}", event);
                throw new ConflictException("No response received from the web client for creating dispatch from the vehicle service");
            }

            logger.info("Received response from vehicle service: {}", rawResponse);
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
            Object loggingResponse = loggingServiceWebClientService.notifyDispatchCreated(event).block();

            logger.info("Dispatched validated event sent via fanout logging response: {}", loggingResponse);
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
            Object loggingResponse = loggingServiceWebClientService.sendDispatchCompletedNotif(event).block();
            Object vehicleResponse = vehicleWebClientService.sendDispatchCompletedMessage(event).block();

            logger.info("Dispatch completed event sent via fanout logging response: {}", loggingResponse);
            logger.info("Dispatch completed event sent via fanout vehicle  response: {}", vehicleResponse);

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
            logger.warn("Attempted to send dispatch validated event: {}", event);
            return;
        }

        try {
            Object loggingResponse = loggingServiceWebClientService.sendDispatchValidatedNotif(event).block();
            Object vehicleResponse = vehicleWebClientService.sendDispatchValidatedMessage(event).block();

            logger.info("Dispatch validated event sent via fanout logging response: {}", loggingResponse);
            logger.info("Dispatch validated event sent via fanout vehicle  response: {}", vehicleResponse);

            logger.info("Dispatch validated event sent: {}", event);
        } catch (Exception e) {
            logger.error("Failed to send dispatch completed event: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send dispatch completed event", e);
        }
    }
}
