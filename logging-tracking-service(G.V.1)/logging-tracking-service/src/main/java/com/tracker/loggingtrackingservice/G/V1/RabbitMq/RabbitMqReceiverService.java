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
    private final String CREATED_DISPATCH_FAN_OUT_QUEUE = "created.dispatch.log.queue";
    private final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);
    private final NotificationService notificationService;


    public RabbitMqReceiverService(NotificationService notificationService) {
        this.notificationService = notificationService;
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
