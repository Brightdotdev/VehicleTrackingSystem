package com.example.DispatchService.RabbitMq;

import com.example.DispatchService.Service.UserDispatchService;
import com.example.DispatchService.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RabbitMqReceiverService {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);


    
    private final String DISPATCH_COMPLETED_FROM_LOGS_QUEUE = "completed.dispatch.fanOut.provider.logs.queue.service.dispatch";

    private final String DISPATCH_TRACKING_FANOUT_EXCHANGE_FOR_RECEIVING_LOGS_QUEUE = "start.tracking.fanOut.provider.logs.queue.dispatch";

    private final UserDispatchService userDispatchService;

    public RabbitMqReceiverService(UserDispatchService userDispatchService) {
        this.userDispatchService = userDispatchService;
    }

    @Transactional
    @RabbitListener(queues = DISPATCH_COMPLETED_FROM_LOGS_QUEUE)
    public void handleDispatchCompletedFromLogs(UtilRecords.DispatchEndedDTO dispatchEvent) {
        try {
            userDispatchService.completeDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing dispatch message: {}", e.getMessage());
        }
    }



    // Handle Tracking notification
    @Transactional
    @RabbitListener(queues = DISPATCH_TRACKING_FANOUT_EXCHANGE_FOR_RECEIVING_LOGS_QUEUE)
    public void handleDispatchTrackingQueue(UtilRecords.StartTrackingDTO trackingEvent) {
        try {
            logger.info("Received Tracking notification: {}", trackingEvent);
            userDispatchService.handleDispatchTracking(trackingEvent);
        } catch (Exception e) {
            logger.error("Error processing Tracking notification: {}", e.getMessage());
        }
    }

}
