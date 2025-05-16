package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Services.TrackingService;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RabbitMqReceiverService {

    // Queue Names (used for RabbitListener bindings)
    private static final String CREATED_DISPATCH_QUEUE = "created.dispatch.fanout.log.queue";
    private static final String END_DISPATCH_QUEUE = "end.dispatch.service.logs";
    private static final String VALIDATED_DISPATCH_QUEUE = "dispatch.validated.queue.service.logs";

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);

    private final NotificationService notificationService;
    private final TrackingService trackingService;

    public RabbitMqReceiverService(NotificationService notificationService, TrackingService trackingService) {
        this.notificationService = notificationService;
        this.trackingService = trackingService;
    }

    // Handle validated dispatch notifications
    @Transactional
    @RabbitListener(queues = VALIDATED_DISPATCH_QUEUE)
    public void handleDispatchValidated(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {
        try {
            logger.info("Received validated dispatch event: {}", dispatchValidatedEvent);
            notificationService.handleValidatedDispatchNotif(dispatchValidatedEvent);
        } catch (Exception e) {
            logger.error("Error processing validated dispatch message: {}", e.getMessage());
        }
    }

    // Handle created dispatch notifications
    @Transactional
    @RabbitListener(queues = CREATED_DISPATCH_QUEUE)
    public void handleDispatchToVehicleQueue(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
        try {
            logger.info("Received created dispatch event: {}", dispatchEvent);
            notificationService.sendCreatedDispatchNotification(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing created dispatch message: {}", e.getMessage());
        }
    }

    // Handle completed or cancelled dispatch notifications
    @Transactional
    @RabbitListener(queues = END_DISPATCH_QUEUE)
    public void handleDispatchCreatedOrCancelled(UtilRecords.DispatchEndedDTO dispatchEvent) {
        try {
            logger.info("Received ended dispatch event: {}", dispatchEvent);
            notificationService.completedDispatchNotification(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing ended dispatch message: {}", e.getMessage());
        }
    }
}
