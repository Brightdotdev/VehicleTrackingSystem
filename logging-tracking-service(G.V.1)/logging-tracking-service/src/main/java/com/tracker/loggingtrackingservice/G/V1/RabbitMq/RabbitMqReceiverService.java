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
    private final String CREATED_DISPATCH_FAN_OUT_QUEUE = "created.dispatch.log.queue";

    private final String DISPATCH_VALIDATED_FAN_OUT_QUEUE_LOGS = "dispatch.validated.queue.service.logs";
    private final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);

    private final NotificationService notificationService;
    private final TrackingService trackingService;

    public RabbitMqReceiverService(NotificationService notificationService, TrackingService trackingService) {
        this.notificationService = notificationService;
        this.trackingService = trackingService;
    }

    @Transactional
    @RabbitListener(queues = DISPATCH_VALIDATED_FAN_OUT_QUEUE_LOGS )
    public void
    handleDispatchValidated(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {
        try {
            notificationService.handleValidatedDispatchNotif(dispatchValidatedEvent);
        } catch (Exception e) {
            logger.error("Error processing dispatch message: {}", e.getMessage());
        }
    }

    @Transactional
    @RabbitListener(queues = CREATED_DISPATCH_FAN_OUT_QUEUE)
    public void
    handleDispatchToVehicleQueue(UtilRecords.dispatchRequestBody dispatchEvent) {
        try {
            notificationService.sendCreatedDispatchNotification(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing dispatch message: {}", e.getMessage());
        }
    }




}
