package com.example.DispatchService.Messaging.WebClient;

import com.example.DispatchService.Exceptions.ConflictException;
import com.example.DispatchService.Messaging.JsonMapper;
import com.example.DispatchService.Messaging.MessagingService;
import com.example.DispatchService.Messaging.ResponseMapperService;
import com.example.DispatchService.Utils.UtilRecords;
import com.example.DispatchService.WebClient.LoggingServiceWebClientService;
import com.example.DispatchService.WebClient.UserServiceWebClientService;
import com.example.DispatchService.WebClient.VehicleWebClientService;
import com.example.DispatchService.Utils.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Messaging service implementation using WebClient to communicate
 * with external services such as vehicle, logging, and user services.
 *
 * Handles sending dispatch-related events and processes ApiResponse objects,
 * throwing ConflictException when operations fail.
 */
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
            LoggingServiceWebClientService loggingServiceWebClientService,
            UserServiceWebClientService userServiceWebClientService,
            ResponseMapperService responseMapperService
    ) {
        this.jsonMapper = jsonMapper;
        this.vehicleWebClientService = vehicleWebClientService;
        this.loggingServiceWebClientService = loggingServiceWebClientService;
        this.userServiceWebClientService = userServiceWebClientService;
        this.responseMapperService = responseMapperService;
    }

    /**
     * Sends a dispatch requested event to the vehicle service and returns
     * the mapped response data.
     *
     * @param event dispatch request event containing VIN and other details
     * @return mapped response data from vehicle service
     * @throws IllegalArgumentException if event or VIN is missing
     * @throws ConflictException if vehicle service returns failure or request fails
     */
    @Override
    public Map<String, Object> sendDispatchRequestedEvent(UtilRecords.dispatchRequestBodyDTO event) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("Invalid dispatch request event: {}", event);
            throw new IllegalArgumentException("Dispatch event is missing VIN");
        }

        try {
            logger.info("Sending dispatch requested event: {}", jsonMapper.convertToJson(event));

            ApiResponse<Map<String, Object>> response = vehicleWebClientService.sendDispatchRequested(event);

            if (!response.isSuccess()) {
                logger.error("Vehicle service error response: {}", response.getMessage());
                throw new ConflictException("Vehicle service responded with error: " + response.getMessage());
            }

            logger.info("Vehicle service responded successfully");

            return responseMapperService.dispatchRequestMapper(response.getData());

        } catch (ConflictException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Failed to send dispatch requested event", e);
            throw new ConflictException("Failed to send dispatch requested event");
        }
    }

    /**
     * Sends a dispatch created event to the logging service.
     * Fire-and-forget: logs failures but does not throw exceptions.
     *
     * @param event dispatch created event to send
     */
    @Override
    public void sendDispatchCreatedEventNoResponse(UtilRecords.dispatchRequestBodyDTO event) {
        if (event == null) {
            logger.warn("Attempted to send null dispatch created event");
            return;
        }

        try {
            ApiResponse<?> loggingResponse = loggingServiceWebClientService.notifyDispatchCreated(event);
            logger.info("Dispatch created event sent to logging service: {}", jsonMapper.convertToJson(loggingResponse));

            if (!loggingResponse.isSuccess()) {
                logger.error("Logging service responded with error on dispatch created event: {}", loggingResponse.getMessage());
            }
        } catch (Exception e) {
            logger.error("Failed to fanout dispatch created event", e);
            // Not throwing here because this is fire-and-forget
        }
    }

    /**
     * Broadcasts a dispatch completed event to both logging and vehicle services.
     * Throws ConflictException on failure to broadcast.
     *
     * @param event dispatch completed event to broadcast
     * @throws ConflictException if broadcast fails
     */
    @Override
    public void sendDispatchCompletedFanoutFromDispatchService(UtilRecords.DispatchEndedDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid dispatch completed event: {}", event);
            return;
        }

        try {
            ApiResponse<?> loggingResponse = loggingServiceWebClientService.sendDispatchCompletedNotif(event);
            ApiResponse<?> vehicleResponse = vehicleWebClientService.sendDispatchCompletedMessage(event);

            logger.info("Dispatch completed event sent (logging): {}", jsonMapper.convertToJson(loggingResponse));
            logger.info("Dispatch completed event sent (vehicle): {}", jsonMapper.convertToJson(vehicleResponse));

            if (!loggingResponse.isSuccess()) {
                logger.error("Logging service responded with error: {}", loggingResponse.getMessage());
                throw new ConflictException("Logging service failed dispatch completed broadcast");
            }
            if (!vehicleResponse.isSuccess()) {
                logger.error("Vehicle service responded with error: {}", vehicleResponse.getMessage());
                throw new ConflictException("Vehicle service failed dispatch completed broadcast");
            }
        } catch (Exception e) {
            logger.error("Failed to broadcast dispatch completed event", e);
            throw new ConflictException("Broadcast failed for dispatch completed event");
        }
    }

    /**
     * Broadcasts a dispatch validated event to both logging and vehicle services.
     * Throws ConflictException on failure to broadcast.
     *
     * @param event validated dispatch event to broadcast
     * @throws ConflictException if broadcast fails
     */
    @Override
    public void sendDispatchValidatedNoResponse(UtilRecords.ValidatedDispatch event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid dispatch validated event: {}", event);
            return;
        }

        try {
            ApiResponse<?> loggingResponse = loggingServiceWebClientService.sendDispatchValidatedNotif(event);
            ApiResponse<?> vehicleResponse = vehicleWebClientService.sendDispatchValidatedMessage(event);

            logger.info("Dispatch validated event sent (logging): {}", jsonMapper.convertToJson(loggingResponse));
            logger.info("Dispatch validated event sent (vehicle): {}", jsonMapper.convertToJson(vehicleResponse));

            if (!loggingResponse.isSuccess()) {
                logger.error("Logging service responded with error: {}", loggingResponse.getMessage());
                throw new ConflictException("Logging service failed dispatch validated broadcast");
            }
            if (!vehicleResponse.isSuccess()) {
                logger.error("Vehicle service responded with error: {}", vehicleResponse.getMessage());
                throw new ConflictException("Vehicle service failed dispatch validated broadcast");
            }
        } catch (Exception e) {
            logger.error("Failed to broadcast validated dispatch event", e);
            throw new ConflictException("Broadcast failed for dispatch validated event");
        }
    }

    /**
     * Sends a user dispatch score update event to the user service.
     * Throws ConflictException if update fails.
     *
     * @param event user dispatch score update DTO
     * @throws ConflictException if the update fails
     */
    @Override
    public void updateUserScore(UtilRecords.DispatchScoreUpdateDto event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid dispatch score update event: {}", event);
            return;
        }

        try {
            ApiResponse<?> userResponse = userServiceWebClientService.updateUserDispatchScore(event);
            logger.info("User dispatch score update event sent: {}", jsonMapper.convertToJson(userResponse));

            if (!userResponse.isSuccess()) {
                logger.error("User service responded with error: {}", userResponse.getMessage());
                throw new ConflictException("User service failed to update dispatch score");
            }
        } catch (Exception e) {
            logger.error("Failed to send user score update event", e);
            throw new ConflictException("Failed to send user score update event");
        }
    }
}
