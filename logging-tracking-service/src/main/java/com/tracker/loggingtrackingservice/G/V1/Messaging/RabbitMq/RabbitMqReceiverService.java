package com.tracker.loggingtrackingservice.G.V1.Messaging.RabbitMq;

import com.tracker.loggingtrackingservice.G.V1.Messaging.WebClient.WebClientJsonMapper;
import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Services.TrackingService;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static com.tracker.loggingtrackingservice.G.V1.Messaging.ExceptionWrapper.runSafely;

@Service
public class RabbitMqReceiverService {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);

    private static final String DISPATCH_CREATED_FANOUT_LOG_QUEUE = "log.service.dispatch.created.fanout.queue";
    private static final String DISPATCH_COMPLETED_FANOUT_LOGS_QUEUE = "completed.dispatch.fanOut.provider.dispatch.service.queue.logs.service";
    private static final String DISPATCH_VALIDATED_FANOUT_LOGS_QUEUE = "validated.dispatch.fanOut.provider.dispatch.service.queue.logs.service";
    private static final String DISPATCH_TRACKING_LOGS_QUEUE = "start.tracking.fanOut.provider.logs.queue.logs";

    private final NotificationService notificationService;
    private final TrackingService trackingService;
    private final WebClientJsonMapper jsonMapper;

    public RabbitMqReceiverService(
            NotificationService notificationService,
            TrackingService trackingService,
            WebClientJsonMapper jsonMapper
    ) {
        this.notificationService = notificationService;
        this.trackingService = trackingService;
        this.jsonMapper = jsonMapper;
    }

    /**
     * ✅ Listener for fanout dispatch creation notifications
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_CREATED_FANOUT_LOG_QUEUE)
    public void handleDispatchCreatedNotification(UtilRecords.dispatchRequestBodyDTO event) {
        runSafely(() -> {
            logger.info("📦 Received RabbitMQ /dispatch-created payload: {}", jsonMapper.convertToJson(event));

            if (event == null || event.vehicleIdentificationNumber() == null) {
                throw new IllegalArgumentException("Invalid dispatchCreated event received");
            }

            notificationService.sendCreatedDispatchNotification(event);
            notificationService.sendCreatedDispatchNotificationsForAdmin(event);
        });
    }

    /**
     * ✅ Listener for completed/cancelled dispatch notifications
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_COMPLETED_FANOUT_LOGS_QUEUE)
    public void handleDispatchCompleted(UtilRecords.DispatchEndedDTO event) {
        runSafely(() -> {
            logger.info("📦 Received RabbitMQ /dispatch-completed payload: {}", jsonMapper.convertToJson(event));

            if (event == null || event.dispatchId() == null) {
                throw new IllegalArgumentException("Invalid dispatchCompleted event received");
            }

            notificationService.completedDispatchNotification(event);
        });
    }

    /**
     * ✅ Listener for validated dispatch notifications
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_VALIDATED_FANOUT_LOGS_QUEUE)
    public void handleDispatchValidated(UtilRecords.ValidatedDispatch event) {
        runSafely(() -> {
            logger.info("📦 Received RabbitMQ /dispatch-validated payload: {}", jsonMapper.convertToJson(event));

            if (event == null || event.dispatchId() == null) {
                throw new IllegalArgumentException("Invalid validatedDispatch event received");
            }

            notificationService.handleValidatedDispatchNotif(event);
            trackingService.handleValidatedDispatchTracking(event);
        });
    }

    /**
     * ✅ Listener for tracking dispatch notifications
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_TRACKING_LOGS_QUEUE)
    public void handleTrackingDispatchNotif(UtilRecords.StartTrackingDTO event) {
        runSafely(() -> {
            logger.info("📦 Received RabbitMQ /start-tracking payload: {}", jsonMapper.convertToJson(event));

            if (event == null || event.dispatchId() == null) {
                throw new IllegalArgumentException("Invalid tracking event received");
            }

            notificationService.handleDispatchTracking(event);
        });
    }
}
