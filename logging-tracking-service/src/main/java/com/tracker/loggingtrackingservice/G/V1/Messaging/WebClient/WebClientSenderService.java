package com.tracker.loggingtrackingservice.G.V1.Messaging.WebClient;

import com.tracker.loggingtrackingservice.G.V1.Messaging.MessagingService;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import com.tracker.loggingtrackingservice.G.V1.WebClient.DispatchServiceWebClient;
import com.tracker.loggingtrackingservice.G.V1.WebClient.VehicleWebClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "webClient", matchIfMissing = true)
public class WebClientSenderService implements MessagingService {

    private static final Logger logger = LoggerFactory.getLogger(WebClientSenderService.class);


    private final DispatchServiceWebClient dispatchServiceWebClient;
    private final VehicleWebClientService vehicleWebClientService;

    public WebClientSenderService(DispatchServiceWebClient dispatchServiceWebClient, VehicleWebClientService vehicleWebClientService) {
        this.dispatchServiceWebClient = dispatchServiceWebClient;
        this.vehicleWebClientService = vehicleWebClientService;
    }

    /**
     * ✅ Send a completed dispatch event to the fanout exchange
     */
    @Override
    public void sendCompletedDispatchFanOut(UtilRecords.DispatchEndedDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Attempted to send null or invalid DispatchEndedDTO: {}", event);
            return;
        }

        try {
          Object  dispatchResponse =  dispatchServiceWebClient.sendDispatchCompletedMessage(event).block();
          Object  vehicleResponse =  vehicleWebClientService.sendDispatchCompletedMessage(event).block();
            logger.info("✅ Sent completed dispatch event from dispatch service: {}", dispatchResponse);
            logger.info("✅ Sent completed dispatch event from vehicle service: {}", vehicleResponse);
        } catch (Exception e) {
            logger.error("❌ Failed to send completed dispatch event: {}", e.getMessage(), e);
        }
    }

    /**
     * ✅ Send a tracking initialization event to the fanout exchange
     */
    @Override
    public void sendTrackingInitializationFanout(UtilRecords.StartTrackingDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Attempted to send null or invalid StartTrackingDTO: {}", event);
            return;
        }

        try {
            Object  dispatchResponse =  dispatchServiceWebClient.sendTrackingInitializationMessage(event).block();
            Object  vehicleResponse =  vehicleWebClientService.sendTrackingInitializationMessage(event).block();
            logger.info("✅ Sent tracking initialisation dispatch event from dispatch service: {}", dispatchResponse);
            logger.info("✅ Sent tracking initialisation dispatch event from vehicle service: {}", vehicleResponse);
        } catch (Exception e) {
            logger.error("❌ Failed to send completed dispatch event: {}", e.getMessage(), e);
        }

    }

    /**
     * ✅ Send a vehicle location update to the tracking checkpoint exchange
     */

    @Override
    public void sendTrackingCheckPointFanOut(UtilRecords.vehicleLocationUpdate event) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("Attempted to send null or invalid vehicleLocationUpdate: {}", event);
            return;
        }

        try {
            Object  dispatchResponse =  dispatchServiceWebClient.sendCheckPoint(event).block();
            Object  vehicleResponse =  vehicleWebClientService.sendCheckPoint(event).block();
            logger.info("✅ Sent tracking location update dispatch event from dispatch service: {}", dispatchResponse);
            logger.info("✅ Sent tracking location update dispatch event from vehicle service: {}", vehicleResponse);
        } catch (Exception e) {
            logger.error("❌ Failed to send completed dispatch event: {}", e.getMessage(), e);
        }
    }
}
