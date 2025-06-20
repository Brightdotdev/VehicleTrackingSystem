package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class RabbitMqSenderService {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqSenderService.class);

    private final RabbitTemplate rabbitTemplate;

    // === Exchange Names (Fanout pattern used, so no routing key needed) ===
    private static final String DISPATCH_TRACKING_CHECKPOINT_EXCHANGE = "tracking.checkPoint.fanOut.provider.logs";
    private static final String DISPATCH_COMPLETED_EXCHANGE = "completed.dispatch.fanOut.provider.logs";
    private static final String DISPATCH_TRACKING_EXCHANGE = "start.tracking.fanOut.provider.logs";

    public RabbitMqSenderService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * ✅ Send a completed dispatch event to the fanout exchange
     */
    public void sendCompletedDispatchFanOut(UtilRecords.DispatchEndedDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Attempted to send null or invalid DispatchEndedDTO: {}", event);
            return;
        }

        try {
            rabbitTemplate.convertAndSend(DISPATCH_COMPLETED_EXCHANGE, "", event);
            logger.info("✅ Sent completed dispatch event: {}", event.dispatchId());
        } catch (Exception e) {
            logger.error("❌ Failed to send completed dispatch event: {}", e.getMessage(), e);
        }
    }

    /**
     * ✅ Send a tracking initialization event to the fanout exchange
     */
    public void sendTrackingInitializationFanout(UtilRecords.StartTrackingDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Attempted to send null or invalid StartTrackingDTO: {}", event);
            return;
        }

        try {
            rabbitTemplate.convertAndSend(DISPATCH_TRACKING_EXCHANGE, "", event);
            logger.info("✅ Sent tracking initialization event: {}", event.dispatchId());
        } catch (Exception e) {
            logger.error("❌ Failed to send tracking initialization event: {}", e.getMessage(), e);
        }
    }

    /**
     * ✅ Send a vehicle location update to the tracking checkpoint exchange
     */
    public void sendTrackingCheckPointFanOut(UtilRecords.vehicleLocationUpdate event) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("Attempted to send null or invalid vehicleLocationUpdate: {}", event);
            return;
        }

        try {
            rabbitTemplate.convertAndSend(DISPATCH_TRACKING_CHECKPOINT_EXCHANGE, "", event);
            logger.info("✅ Sent vehicle location update for VIN: {}", event.vehicleIdentificationNumber());
        } catch (Exception e) {
            logger.error("❌ Failed to send vehicle location update: {}", e.getMessage(), e);
        }
    }
}
