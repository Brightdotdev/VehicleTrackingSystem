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

    /* =========== Private Safe Wrappers =========== */

    /**
     * Wrapper for sending dispatch requested event safely.
     */
    private Map<String, Object> safeSendDispatchRequestedEvent(UtilRecords.dispatchRequestBodyDTO event) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            throw new IllegalArgumentException("Dispatch event is missing VIN");
        }

        try {
            logger.info("Sending dispatch requested event: {}", jsonMapper.convertToJson(event));
            ApiResponse<Map<String, Object>> response = vehicleWebClientService.sendDispatchRequested(event);

            if (!response.isSuccess()) {
                logAndThrowConflict("Vehicle service", response.getMessage());
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
     * Wrapper for sending dispatch created event safely.
     * Fire-and-forget, logs errors but does not throw.
     */
    private void safeSendDispatchCreatedEvent(UtilRecords.dispatchRequestBodyDTO event) {
        if (event == null) {
            logger.warn("Attempted to send null dispatch created event");
            return;
        }

        try {
            ApiResponse<?> response = loggingServiceWebClientService.notifyDispatchCreated(event);
            logger.info("Dispatch created event sent to logging service: {}", jsonMapper.convertToJson(response));
            if (!response.isSuccess()) {
                logger.error("Logging service responded with error on dispatch created event: {}", response.getMessage());
            }
        } catch (Exception e) {
            logger.error("Failed to fanout dispatch created event", e);
        }
    }

    /**
     * Wrapper for sending dispatch completed fanout safely.
     */
    private void safeSendDispatchCompletedFanout(UtilRecords.DispatchEndedDTO event) {
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
                logAndThrowConflict("Logging service", loggingResponse.getMessage());
            }
            if (!vehicleResponse.isSuccess()) {
                logAndThrowConflict("Vehicle service", vehicleResponse.getMessage());
            }

        } catch (Exception e) {
            logger.error("Failed to broadcast dispatch completed event", e);
            throw new ConflictException("Broadcast failed for dispatch completed event");
        }
    }

    /**
     * Wrapper for sending dispatch validated fanout safely.
     */
    private void safeSendDispatchValidatedFanout(UtilRecords.ValidatedDispatch event) {
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
                logAndThrowConflict("Logging service", loggingResponse.getMessage());
            }
            if (!vehicleResponse.isSuccess()) {
                logAndThrowConflict("Vehicle service", vehicleResponse.getMessage());
            }
        } catch (Exception e) {
            logger.error("Failed to broadcast validated dispatch event", e);
            throw new ConflictException("Broadcast failed for dispatch validated event");
        }
    }

    /**
     * Wrapper for updating user score safely.
     */
    private void safeUpdateUserScore(UtilRecords.DispatchScoreUpdateDto event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid dispatch score update event: {}", event);
            return;
        }

        try {
            ApiResponse<?> userResponse = userServiceWebClientService.updateUserDispatchScore(event);
            logger.info("User dispatch score update event sent: {}", jsonMapper.convertToJson(userResponse));

            if (!userResponse.isSuccess()) {
                logAndThrowConflict("User service", userResponse.getMessage());
            }
        } catch (Exception e) {
            logger.error("Failed to send user score update event", e);
            throw new ConflictException("Failed to send user score update event");
        }
    }

    /**
     * Helper to log error and throw ConflictException with detailed message.
     */
    private void logAndThrowConflict(String serviceName, String errorMessage) {
        logger.error("{} responded with error: {}", serviceName, errorMessage);
        throw new ConflictException(serviceName + " failed with message: " + errorMessage);
    }

    /* ========== MessagingService interface implementation ========== */

    @Override
    public Map<String, Object> sendDispatchRequestedEvent(UtilRecords.dispatchRequestBodyDTO event) {
        return safeSendDispatchRequestedEvent(event);
    }

    @Override
    public void sendDispatchCreatedEventNoResponse(UtilRecords.dispatchRequestBodyDTO event) {
        safeSendDispatchCreatedEvent(event);
    }

    @Override
    public void sendDispatchCompletedFanoutFromDispatchService(UtilRecords.DispatchEndedDTO event) {
        safeSendDispatchCompletedFanout(event);
    }

    @Override
    public void sendDispatchValidatedNoResponse(UtilRecords.ValidatedDispatch event) {
        safeSendDispatchValidatedFanout(event);
    }

    @Override
    public void updateUserScore(UtilRecords.DispatchScoreUpdateDto event) {
        safeUpdateUserScore(event);
    }
}
