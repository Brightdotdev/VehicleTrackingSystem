package com.example.DispatchService.Messaging.RabbitMq;

import com.example.DispatchService.Service.UserDispatchService;
import com.example.DispatchService.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "rabbitMq", matchIfMissing = true)
public class RabbitMqReceiverService {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);

    private static final String DISPATCH_COMPLETED_FROM_LOGS_QUEUE = "completed.dispatch.fanOut.provider.logs.queue.service.dispatch";
    private static final String DISPATCH_TRACKING_FROM_LOGS_QUEUE = "start.tracking.fanOut.provider.logs.queue.dispatch";

    private final UserDispatchService userDispatchService;

    public RabbitMqReceiverService(UserDispatchService userDispatchService) {
        this.userDispatchService = userDispatchService;
    }

    /**
     * Handles a dispatch completed event sent from the logs service.
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_COMPLETED_FROM_LOGS_QUEUE)
    public void handleDispatchCompletedFromLogs(UtilRecords.DispatchEndedDTO dispatchEvent) {
        if (dispatchEvent == null || dispatchEvent.dispatchId() == null) {
            logger.warn("Received invalid dispatchCompleted event: {}", dispatchEvent);
            return;
        }

        try {
            userDispatchService.completeDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing dispatchCompleted event: {}", e.getMessage(), e);
            // You can optionally rethrow if you want RabbitMQ to retry later
        }
    }

    /**
     * Handles a dispatch tracking start event sent from the logs service.
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_TRACKING_FROM_LOGS_QUEUE)
    public void handleDispatchTrackingQueue(UtilRecords.StartTrackingDTO trackingEvent) {
        if (trackingEvent == null || trackingEvent.dispatchId() == null) {
            logger.warn("Received invalid startTracking event: {}", trackingEvent);
            return;
        }

        try {
            userDispatchService.handleDispatchTracking(trackingEvent);
        } catch (Exception e) {
            logger.error("Error processing startTracking event: {}", e.getMessage(), e);
        }
    }
}
