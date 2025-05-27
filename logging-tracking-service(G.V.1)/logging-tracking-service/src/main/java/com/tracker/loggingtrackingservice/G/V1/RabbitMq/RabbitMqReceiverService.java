package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RabbitMqReceiverService {

    // Queue Names (used for RabbitListener bindings)

    private static final String DISPATCH_CREATED_FANOUT_LOG_QUEUE = "log.service.dispatch.created.fanout.queue";

    private final String DISPATCH_COMPLETED_FANOUT_LOGS_QUEUE = "completed.dispatch.fanOut.provider.dispatch.service.queue.logs.service";

    private final String DISPATCH_VALIDATED_FANOUT_LOGS_QUEUE = "validated.dispatch.fanOut.provider.dispatch.service.queue.logs.service";

    // cool stuff

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);

    private final NotificationService notificationService;
    public RabbitMqReceiverService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }


    // Handle created dispatch notifications

    @Transactional
    @RabbitListener(queues = DISPATCH_CREATED_FANOUT_LOG_QUEUE)
    public void handleDispatchCreatedNoResponseFanout(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
        try {
            logger.info("Received created dispatch event: {}", dispatchEvent);
            notificationService.sendCreatedDispatchNotification(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing created dispatch message: {}", e.getMessage());
        }
    }

    // Handle completed or cancelled dispatch notifications

    @Transactional
    @RabbitListener(queues = DISPATCH_COMPLETED_FANOUT_LOGS_QUEUE)
    public void handleDispatchCompleted(UtilRecords.DispatchEndedDTO dispatchEvent) {
        try {
            logger.info("Received completed : {}", dispatchEvent);
            notificationService.completedDispatchNotification(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing completed dispatch: {}", e.getMessage());
        }
    }




    // Handle validated dispatch notifications
    @Transactional
    @RabbitListener(queues = DISPATCH_VALIDATED_FANOUT_LOGS_QUEUE)
    public void handleDispatchValidated(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {
        try {
            logger.info("Received validated dispatch event: {}", dispatchValidatedEvent);
            notificationService.handleValidatedDispatchNotif(dispatchValidatedEvent);
        } catch (Exception e) {
            logger.error("Error processing validated dispatch message: {}", e.getMessage());
        }
    }
}
