package com.tracker.loggingtrackingservice.G.V1.Messaging.WebClient;

import com.tracker.loggingtrackingservice.G.V1.Messaging.MessagingService;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import com.tracker.loggingtrackingservice.G.V1.WebClient.DispatchServiceWebClient;
import com.tracker.loggingtrackingservice.G.V1.WebClient.VehicleWebClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "webClient", matchIfMissing = true)
public class WebClientSenderService implements MessagingService {

    private static final Logger logger = LoggerFactory.getLogger(WebClientSenderService.class);

    private final WebClientJsonMapper formatterService;
    private final DispatchServiceWebClient dispatchServiceWebClient;
    private final VehicleWebClientService vehicleWebClientService;

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
     * ✅ Fanout completed dispatch to both dispatch and vehicle services
     */
    @Override
    public void sendCompletedDispatchFanOut(UtilRecords.DispatchEndedDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("⚠️ Invalid completed dispatch event: {}", event);
            return;
        }

        try {
            Object dispatchResponse = dispatchServiceWebClient.sendDispatchCompletedMessage(event).block();
            Object vehicleResponse = vehicleWebClientService.sendDispatchCompletedMessage(event).block();

            logger.info("✅ Dispatch service response: {}", formatterService.convertToJson(dispatchResponse));
            logger.info("✅ Vehicle service response: {}", formatterService.convertToJson(vehicleResponse));
        } catch (Exception e) {
            logger.error("❌ Failed to fanout completed dispatch: {}", e.getMessage(), e);
        }
    }

    /**
     * ✅ Fanout tracking initialization event
     */
    @Override
    public void sendTrackingInitializationFanout(UtilRecords.StartTrackingDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("⚠️ Invalid tracking init event: {}", event);
            return;
        }

        try {
            Object dispatchResponse = dispatchServiceWebClient.sendTrackingInitializationMessage(event).block();
            Object vehicleResponse = vehicleWebClientService.sendTrackingInitializationMessage(event).block();

            logger.info("✅ Tracking init dispatch response: {}", formatterService.convertToJson(dispatchResponse));
            logger.info("✅ Tracking init vehicle response: {}", formatterService.convertToJson(vehicleResponse));
        } catch (Exception e) {
            logger.error("❌ Failed to fanout tracking init event: {}", e.getMessage(), e);
        }
    }

    /**
     * ✅ Fanout vehicle location checkpoint update
     */
    @Override
    public void sendTrackingCheckPointFanOut(UtilRecords.vehicleLocationUpdate event) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("⚠️ Invalid vehicle location update: {}", event);
            return;
        }

        try {

            Object vehicleResponse = vehicleWebClientService.sendCheckPoint(event).block();


            logger.info("✅ Checkpoint vehicle response: {}", formatterService.convertToJson(vehicleResponse));
        } catch (Exception e) {
            logger.error("❌ Failed to fanout vehicle checkpoint update: {}", e.getMessage(), e);
        }
    }
}
