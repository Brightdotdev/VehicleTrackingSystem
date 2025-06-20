package com.tracker.loggingtrackingservice.G.V1.RabbitMq;

import com.tracker.loggingtrackingservice.G.V1.Models.AdminModel;
import com.tracker.loggingtrackingservice.G.V1.Repositories.AdminRepository;
import com.tracker.loggingtrackingservice.G.V1.Services.NotificationService;
import com.tracker.loggingtrackingservice.G.V1.Services.TrackingService;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
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

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);

    // Queue names
    private static final String ADMIN_CREATED_DIRECT_EXCHANGE_QUEUE = "logs.service.created.admin.queue";
    private static final String DISPATCH_CREATED_FANOUT_LOG_QUEUE = "log.service.dispatch.created.fanout.queue";
    private static final String DISPATCH_COMPLETED_FANOUT_LOGS_QUEUE = "completed.dispatch.fanOut.provider.dispatch.service.queue.logs.service";
    private static final String DISPATCH_VALIDATED_FANOUT_LOGS_QUEUE = "validated.dispatch.fanOut.provider.dispatch.service.queue.logs.service";
    private static final String DISPATCH_TRACKING_LOGS_QUEUE = "start.tracking.fanOut.provider.logs.queue.logs";

    private final NotificationService notificationService;
    private final TrackingService trackingService;
    private final AdminRepository adminRepository;

    public RabbitMqReceiverService(NotificationService notificationService, TrackingService trackingService, AdminRepository adminRepository) {
        this.notificationService = notificationService;
        this.trackingService = trackingService;
        this.adminRepository = adminRepository;
    }

    /**
     * ✅ Admin creation listener — handles saving or returning existing admin
     */
    @Transactional
    @RabbitListener(queues = ADMIN_CREATED_DIRECT_EXCHANGE_QUEUE)
    public Map<String, Object> handleAdminCreatedQueue(UtilRecords.adminCreatedRequestBodyDto requestBody) {
        Map<String, Object> response = new HashMap<>();

        if (requestBody == null || requestBody.email() == null || requestBody.email().isBlank()) {
            logger.warn("Received invalid admin creation request: {}", requestBody);
            response.put("createdNew", false);
            return response;
        }

        try {
            AdminModel foundAdmin = adminRepository.findByEmail(requestBody.email());

            if (foundAdmin != null) {
                response.put("createdNew", false);
                return response;
            }

            AdminModel newAdmin = new AdminModel();
            newAdmin.setEmail(requestBody.email());
            newAdmin.setJoinedAt(LocalDateTime.now());
            newAdmin.setValidated(true);
            adminRepository.save(newAdmin);

            response.put("createdNew", true);
            return response;

        } catch (Exception e) {
            logger.error("Failed to process admin creation request: {}", e.getMessage(), e);
            return null;  // Allows RabbitMQ to treat this as handled without requeue
        }
    }

    /**
     * ✅ Listener for fanout dispatch creation notifications
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_CREATED_FANOUT_LOG_QUEUE)
    public void handleDispatchCreatedNotification(UtilRecords.dispatchRequestBodyDTO event) {
        if (event == null || event.vehicleIdentificationNumber() == null) {
            logger.warn("Invalid dispatchCreated event received: {}", event);
            return;
        }

        try {
            notificationService.sendCreatedDispatchNotification(event);
            notificationService.sendCreatedDispatchNotificationsForAdmin(event);
        } catch (Exception e) {
            logger.error("Error handling dispatchCreated event: {}", e.getMessage(), e);
        }
    }

    /**
     * ✅ Listener for completed/cancelled dispatch notifications
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_COMPLETED_FANOUT_LOGS_QUEUE)
    public void handleDispatchCompleted(UtilRecords.DispatchEndedDTO event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid dispatchCompleted event received: {}", event);
            return;
        }

        try {
            notificationService.completedDispatchNotification(event);
        } catch (Exception e) {
            logger.error("Error handling dispatchCompleted event: {}", e.getMessage(), e);
        }
    }

    /**
     * ✅ Listener for validated dispatch notifications
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_VALIDATED_FANOUT_LOGS_QUEUE)
    public void handleDispatchValidated(UtilRecords.ValidatedDispatch event) {
        if (event == null || event.dispatchId() == null) {
            logger.warn("Invalid validatedDispatch event received: {}", event);
            return;
        }

        try {
            notificationService.handleValidatedDispatchNotif(event);
            trackingService.handleValidatedDispatchTracking(event);
        } catch (Exception e) {
            logger.error("Error handling validatedDispatch event: {}", e.getMessage(), e);
        }
    }

    /**
     * ✅ Listener for tracking dispatch notifications
     */
    @Transactional
    @RabbitListener(queues = DISPATCH_TRACKING_LOGS_QUEUE)
    public void handleTrackingDispatchNotif(UtilRecords.StartTrackingDTO trackingEvent) {
        if (trackingEvent == null || trackingEvent.dispatchId() == null) {
            logger.warn("Invalid tracking event received: {}", trackingEvent);
            return;
        }

        try {
            notificationService.handleDispatchTracking(trackingEvent);
        } catch (Exception e) {
            logger.error("Error handling tracking dispatch notification: {}", e.getMessage(), e);
        }
    }
}
