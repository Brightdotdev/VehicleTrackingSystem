package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import com.fasterxml.jackson.databind.util.ObjectBuffer;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.ConflictException;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.NotFoundException;
import com.tracker.loggingtrackingservice.G.V1.Models.AdminModel;
import com.tracker.loggingtrackingservice.G.V1.Repositories.AdminRepository;
import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Services.TrackingService;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class RabbitMqReceiverService {

    // Queue Names (used for RabbitListener bindings)

    private final String ADMIN_CREATED_DIRECT_EXCHANGE_QUEUE = "logs.service.created.admin.queue";

    private static final String DISPATCH_CREATED_FANOUT_LOG_QUEUE = "log.service.dispatch.created.fanout.queue";

    private final String DISPATCH_COMPLETED_FANOUT_LOGS_QUEUE = "completed.dispatch.fanOut.provider.dispatch.service.queue.logs.service";

    private final String DISPATCH_VALIDATED_FANOUT_LOGS_QUEUE = "validated.dispatch.fanOut.provider.dispatch.service.queue.logs.service";
    private final String DISPATCH_TRACKING_FANOUT_EXCHANGE_FOR_RECEIVING_LOGS_QUEUE = "start.tracking.fanOut.provider.logs.queue.logs";
    // cool stuff

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);


    private final NotificationService notificationService;
    private final TrackingService trackingService;

    private final AdminRepository adminRepository;

    public RabbitMqReceiverService(NotificationService notificationService, TrackingService trackingService, AdminRepository adminRepository) {
        this.trackingService = trackingService;
        this.adminRepository = adminRepository;
        this.notificationService = notificationService;
    }



    //saving a new admin

    @Transactional
    @RabbitListener(queues = ADMIN_CREATED_DIRECT_EXCHANGE_QUEUE )
    public Map<String, Object> handleDispatchToVehicleQueue(UtilRecords.adminCreatedRequestBodyDto createdReqBody) {
        try {
            Map<String, Object> finalResponse = new HashMap<>();
            AdminModel foundAdmin = adminRepository.findByEmail(createdReqBody.email());


            if (foundAdmin != null) {
                    finalResponse.put("createdNew", false);
                return finalResponse;
            }
            AdminModel newAdmin = new AdminModel();
            newAdmin.setEmail(createdReqBody.email());
            newAdmin.setJoinedAt(LocalDateTime.now());
            newAdmin.setValidated(true);
            adminRepository.save(newAdmin);

            finalResponse.put("createdNew", true);

            return finalResponse;
            } catch (Exception e) {
            logger.error("Error processing dispatch message: {}", e.getMessage(), e);
            return null;
            }
    }



    // Handle created dispatch notifications

    @Transactional
    @RabbitListener(queues = DISPATCH_CREATED_FANOUT_LOG_QUEUE)
    public void handleDispatchCreatedNoResponseFanout(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
        try {
            logger.info("Received created dispatch event: {}", dispatchEvent);
            notificationService.sendCreatedDispatchNotification(dispatchEvent);
            notificationService.sendCreatedDispatchNotificationsForAdmin(dispatchEvent);
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
            trackingService.handleValidatedDispatchTracking(dispatchValidatedEvent);
        } catch (Exception e) {
            logger.error("Error processing validated dispatch message: {}", e.getMessage());
        }
    }

   // Handle Tracking notification
    @Transactional
    @RabbitListener(queues = DISPATCH_TRACKING_FANOUT_EXCHANGE_FOR_RECEIVING_LOGS_QUEUE)
    public void handleTrackingODispatchNotif(UtilRecords.StartTrackingDTO trackingEvent) {
        try {
            logger.info("Received Tracking notification: {}", trackingEvent);
            notificationService.handleDispatchTracking(trackingEvent);
        } catch (Exception e) {
            logger.error("Error processing Tracking notification: {}", e.getMessage());
        }
    }
}
