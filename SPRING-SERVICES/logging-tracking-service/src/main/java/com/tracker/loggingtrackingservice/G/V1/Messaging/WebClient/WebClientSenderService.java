package com.tracker.loggingtrackingservice.G.V1.Messaging.WebClient;

import com.tracker.loggingtrackingservice.G.V1.Exceptions.ConflictException;
import com.tracker.loggingtrackingservice.G.V1.Messaging.MessagingService;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import com.tracker.loggingtrackingservice.G.V1.WebClient.DispatchServiceWebClient;
import com.tracker.loggingtrackingservice.G.V1.WebClient.VehicleWebClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * WebClient-based implementation of MessagingService
 * responsible for fanout messaging to dispatch and vehicle services.
 *
 * Handles dispatch completion, tracking initialization, and location checkpoint events.
 * Calls are wrapped with error-safe methods that parse error responses and log nicely.
 */
@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "webClient", matchIfMissing = true)
public class WebClientSenderService implements MessagingService {

    private static final Logger logger = LoggerFactory.getLogger(WebClientSenderService.class);

    private final WebClientJsonMapper formatterService;
    private final DispatchServiceWebClient dispatchServiceWebClient;
    private final VehicleWebClientService vehicleWebClientService;
    private final ObjectMapper objectMapper = new ObjectMapper(); // for parsing JSON error responses

    public WebClientSenderService(
            WebClientJsonMapper formatterService,
            DispatchServiceWebClient dispatchServiceWebClient,
            VehicleWebClientService vehicleWebClientService
    ) {
        this.formatterService = formatterService;
        this.dispatchServiceWebClient = dispatchServiceWebClient;
        this.vehicleWebClientService = vehicleWebClientService;
    }

    /**
     * Wrapper to safely send dispatch completed message.
     * Parses error response and throws ConflictException with message if any error occurs.
     */
    private void safeSendDispatchCompletedMessage(UtilRecords.DispatchEndedDTO event) {
        try {
            Object response = dispatchServiceWebClient.sendDispatchCompletedMessage(event);
            logger.info("✅ Dispatch service response: {}", formatterService.convertToJson(response));
        } catch (Exception e) {
            handleAndThrowDetailedError("Dispatch service", e);
        }
    }

    /**
     * Wrapper to safely send vehicle completed message.
     * Parses error response and throws ConflictException with message if any error occurs.
     */
    private void safeSendVehicleDispatchCompletedMessage(UtilRecords.DispatchEndedDTO event) {
        try {
            Object response = vehicleWebClientService.sendDispatchCompletedMessage(event);
            logger.info("✅ Vehicle service response: {}", formatterService.convertToJson(response));
        } catch (Exception e) {
            handleAndThrowDetailedError("Vehicle service", e);
        }
    }

    /**
     * Wrapper for safe tracking initialization dispatch call.
     */
    private void safeSendTrackingInitDispatchMessage(UtilRecords.StartTrackingDTO event) {
        try {
            Object response = dispatchServiceWebClient.sendTrackingInitializationMessage(event);
            logger.info("✅ Tracking init dispatch response: {}", formatterService.convertToJson(response));
        } catch (Exception e) {
            handleAndThrowDetailedError("Dispatch service", e);
        }
    }

    /**
     * Wrapper for safe tracking initialization vehicle call.
     */
    private void safeSendTrackingInitVehicleMessage(UtilRecords.StartTrackingDTO event) {
        try {
            Object response = vehicleWebClientService.sendTrackingInitializationMessage(event);
            logger.info("✅ Tracking init vehicle response: {}", formatterService.convertToJson(response));
        } catch (Exception e) {
            handleAndThrowDetailedError("Vehicle service", e);
        }
    }

    /**
     * Wrapper for safe vehicle checkpoint update call.
     */
    private void safeSendVehicleCheckpointMessage(UtilRecords.vehicleLocationUpdate event) {
        try {
            Object response = vehicleWebClientService.sendCheckPoint(event);
            logger.info("✅ Checkpoint vehicle response: {}", formatterService.convertToJson(response));
        } catch (Exception e) {
            handleAndThrowDetailedError("Vehicle service", e);
        }
    }

    /**
     * Parses error response JSON if possible, logs and throws ConflictException with detailed message.
     * @param serviceName the service that threw the error
     * @param e the caught exception
     */
    private void handleAndThrowDetailedError(String serviceName, Exception e) {
        String detailedMsg = e.getMessage();

        // Try to parse JSON error message from the exception message if possible
        try {
            if (detailedMsg != null && detailedMsg.contains("{")) {
                // Extract JSON substring
                int jsonStart = detailedMsg.indexOf("{");
                String jsonPart = detailedMsg.substring(jsonStart);

                JsonNode errorNode = objectMapper.readTree(jsonPart);

                // Extract "message" field if exists, fallback to whole JSON string
                if (errorNode.has("message")) {
                    detailedMsg = errorNode.get("message").asText();
                } else {
                    detailedMsg = errorNode.toString();
                }
            }
        } catch (Exception parseEx) {
            // Ignore parse exceptions, keep original message
            logger.warn("⚠️ Failed to parse error JSON from {} exception message: {}", serviceName, parseEx.getMessage());
        }

        logger.error("❌ {} responded with error: {}", serviceName, detailedMsg);
        throw new ConflictException(serviceName + " failed with message: " + detailedMsg);
    }

    /* ============== MessagingService implementation with safe calls ============== */

    @Override
    public void sendCompletedDispatchFanOut(UtilRecords.DispatchEndedDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("⚠️ Invalid completed dispatch event: {}", event);
            return;
        }

        // Use safe wrappers to send messages
        safeSendDispatchCompletedMessage(event);
        safeSendVehicleDispatchCompletedMessage(event);
    }

    @Override
    public void sendTrackingInitializationFanout(UtilRecords.StartTrackingDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("⚠️ Invalid tracking init event: {}", event);
            return;
        }

        safeSendTrackingInitDispatchMessage(event);
        safeSendTrackingInitVehicleMessage(event);
    }

    @Override
    public void sendTrackingCheckPointFanOut(UtilRecords.vehicleLocationUpdate event) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("⚠️ Invalid vehicle location update: {}", event);
            return;
        }
        safeSendVehicleCheckpointMessage(event);
    }
}
