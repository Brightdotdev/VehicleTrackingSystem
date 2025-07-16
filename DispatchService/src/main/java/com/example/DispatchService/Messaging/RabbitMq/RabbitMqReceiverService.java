package com.example.DispatchService.Messaging.RabbitMq;

import com.example.DispatchService.Messaging.JsonMapper;
import com.example.DispatchService.Service.UserDispatchService;
import com.example.DispatchService.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.example.DispatchService.Messaging.WebClient.ExceptionWrapper.runSafely;

@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "rabbitMq", matchIfMissing = true)
public class RabbitMqReceiverService {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);

    private static final String DISPATCH_COMPLETED_FROM_LOGS_QUEUE = "completed.dispatch.fanOut.provider.logs.queue.service.dispatch";
    private static final String DISPATCH_TRACKING_FROM_LOGS_QUEUE = "start.tracking.fanOut.provider.logs.queue.dispatch";

    private final UserDispatchService userDispatchService;
    private final JsonMapper jsonMapper;

    public RabbitMqReceiverService(UserDispatchService userDispatchService, JsonMapper jsonMapper) {
        this.userDispatchService = userDispatchService;
        this.jsonMapper = jsonMapper;
    }

    /**
     * ✅ Handles a dispatch completed event sent from the logs service.
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_COMPLETED_FROM_LOGS_QUEUE)
    public void handleDispatchCompletedFromLogs(UtilRecords.DispatchEndedDTO dispatchEvent) {
        runSafely(() -> {
            logger.info("📦 Received RabbitMQ /dispatch-completed payload: {}", jsonMapper.convertToJson(dispatchEvent));

            if (dispatchEvent == null || dispatchEvent.dispatchId() == null) {
                throw new IllegalArgumentException("Invalid dispatchCompleted event received");
            }

            userDispatchService.completeDispatch(dispatchEvent);
        });
    }

    /**
     * ✅ Handles a dispatch tracking start event sent from the logs service.
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_TRACKING_FROM_LOGS_QUEUE)
    public void handleDispatchTrackingQueue(UtilRecords.StartTrackingDTO trackingEvent) {
        runSafely(() -> {
            logger.info("📦 Received RabbitMQ /track payload: {}", jsonMapper.convertToJson(trackingEvent));

            if (trackingEvent == null || trackingEvent.dispatchId() == null) {
                throw new IllegalArgumentException("Invalid tracking event received");
            }

            userDispatchService.handleDispatchTracking(trackingEvent);
        });
    }
}
