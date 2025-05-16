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

    // -- Queue name constant --
    private static final String COMPLETED_DISPATCH_QUEUE = "completed.dispatch.service.dispatch.fanOut";

    private final UserDispatchService userDispatchService;

    public RabbitMqReceiverService(UserDispatchService userDispatchService) {
        this.userDispatchService = userDispatchService;
    }

    /**
     * ✅ Listener method to handle completed dispatch events.
     */
    @Transactional
    @RabbitListener(queues = COMPLETED_DISPATCH_QUEUE)
    public void handleDispatchCompleted(UtilRecords.DispatchCompletedEvent dispatchEvent) {
        try {
            userDispatchService.completeDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing dispatch message: {}", e.getMessage());
        }
    }
}
