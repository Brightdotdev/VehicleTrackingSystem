package com.example.DispatchService.Messaging.WebClient;

import com.example.DispatchService.Exceptions.ConflictException;
import com.example.DispatchService.Messaging.JsonMapper;
import com.example.DispatchService.Messaging.MessagingService;
import com.example.DispatchService.Messaging.ResponseMapperService;
import com.example.DispatchService.Utils.UtilRecords;
import com.example.DispatchService.WebClient.LoggingServiceWebClientService;
import com.example.DispatchService.WebClient.UserServiceWebClientService;
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

    private final JsonMapper jsonMapper;
    private final VehicleWebClientService vehicleWebClientService;
    private final LoggingServiceWebClientService loggingServiceWebClientService;
    private final UserServiceWebClientService userServiceWebClientService;
    private final ResponseMapperService responseMapperService;

    public WebClientSenderService(
            JsonMapper jsonMapper,
            VehicleWebClientService vehicleWebClientService,
            LoggingServiceWebClientService loggingServiceWebClientService, UserServiceWebClientService userServiceWebClientService,
            ResponseMapperService responseMapperService
    ) {
        this.jsonMapper = jsonMapper;
        this.vehicleWebClientService = vehicleWebClientService;
        this.loggingServiceWebClientService = loggingServiceWebClientService;
        this.userServiceWebClientService = userServiceWebClientService;
        this.responseMapperService = responseMapperService;
    }

    /**
     * Sends a dispatch requested event and expects a response.
     */
    @Override
    public Map<String, Object> sendDispatchRequestedEvent(UtilRecords.dispatchRequestBodyDTO event) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("Invalid dispatch request event: {}", event);
            throw new IllegalArgumentException("Dispatch event is missing VIN");
        }

        try {

            logger.info("THis is what the dispatch service is sending:  {}",
jsonMapper.convertToJson(event)
                    );

            Object rawResponse = vehicleWebClientService.sendDispatchRequested(event).block();

            if (rawResponse == null) {
                logger.error("Vehicle service did not respond for dispatch request: {}", event);
                throw new ConflictException("No response received from vehicle service");
            }

            logger.info("Vehicle service response: {}", rawResponse);
            return responseMapperService.dispatchRequestMapper(rawResponse);

        } catch (ConflictException e) {
            throw e; // allow known exceptions to bubble up
        } catch (Exception e) {
            logger.error("Failed to send dispatch request event: {}", e.getMessage(), e);
            throw new ConflictException("Failed to send dispatch request event");
        }
    }

    /**
     * Sends a dispatch created event to logging service without expecting a response.
     */
    @Override
    public void sendDispatchCreatedEventNoResponse(UtilRecords.dispatchRequestBodyDTO event) {
        if (event == null) {
            logger.warn("Attempted to send null dispatch created event");
            return;
        }

        try {
            Object loggingResponse = loggingServiceWebClientService.notifyDispatchCreated(event).block();
            logger.info("Dispatch created event (fanout) sent. Logging response: {}", jsonMapper.convertToJson(loggingResponse));

        } catch (Exception e) {
            logger.error("Failed to fanout dispatch created event", e);
            throw new ConflictException("Failed to fanout dispatch created event");
        }
    }

    /**
     * Broadcasts a dispatch completed event to logging and vehicle services.
     */
    @Override
    public void sendDispatchCompletedFanoutFromDispatchService(UtilRecords.DispatchEndedDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid dispatch completed event: {}", event);
            return;
        }

        try {
            Object loggingResponse = loggingServiceWebClientService.sendDispatchCompletedNotif(event).block();
            Object vehicleResponse = vehicleWebClientService.sendDispatchCompletedMessage(event).block();

            logger.info("Dispatch completed event sent (logging): {}", jsonMapper.convertToJson(loggingResponse));
            logger.info("Dispatch completed event sent (vehicle): {}", jsonMapper.convertToJson(vehicleResponse));

        } catch (Exception e) {
            logger.error("Failed to broadcast dispatch completed event", e);
            throw new ConflictException("Broadcast failed for dispatch completed event");
        }
    }

    /**
     * Broadcasts a validated dispatch event to both services.
     */
    @Override
    public void sendDispatchValidatedNoResponse(UtilRecords.ValidatedDispatch event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid dispatch validated event: {}", event);
            return;
        }

        try {
            Object loggingResponse = loggingServiceWebClientService.sendDispatchValidatedNotif(event).block();
            Object vehicleResponse = vehicleWebClientService.sendDispatchValidatedMessage(event).block();

            logger.info("Dispatch validated event sent (logging): {}", jsonMapper.convertToJson(loggingResponse));
            logger.info("Dispatch validated event sent (vehicle): {}", jsonMapper.convertToJson(vehicleResponse));

        } catch (Exception e) {
            logger.error("Failed to broadcast validated dispatch event", e);
            throw new ConflictException("Broadcast failed for dispatch validated event");
        }
    }


    public  void updateUserScore(UtilRecords.DispatchScoreUpdateDto event){
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid dispatch score update event: {}", event);
            return;
        }

        try {
            Object vehicleResponse = userServiceWebClientService.updateUserDispatchScore(event).block();
      logger.info("user vehicle score update event sent (vehicle): {}", jsonMapper.convertToJson(vehicleResponse));
        } catch (Exception e) {
            logger.error("Failed to Send User Score update", e);
            throw new ConflictException("Failed to Send User Score update event");
        }


    }
}
