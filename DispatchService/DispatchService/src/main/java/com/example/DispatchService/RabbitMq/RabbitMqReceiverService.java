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

    private final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);
        private final String COMPLETED_DISPATCH_FAN_OUT_QUEUE = "completed.dispatch.service.dispatch.fanOut";

    private final UserDispatchService userDispatchService;

    public RabbitMqReceiverService(UserDispatchService userDispatchService) {
        this.userDispatchService = userDispatchService;
    }

        @Transactional
        @RabbitListener(queues = COMPLETED_DISPATCH_FAN_OUT_QUEUE)
        public void 
        handleDispatchToVehicleQueue(UtilRecords.DispatchCompletedEvent dispatchEvent) {
        try {
            userDispatchService.completeDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing dispatch message: {}", e.getMessage());
        }
    }

}
