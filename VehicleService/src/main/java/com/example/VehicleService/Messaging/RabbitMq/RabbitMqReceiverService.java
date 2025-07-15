package com.example.VehicleService.Messaging.RabbitMq;

import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Repositories.VehicleRepository;
import com.example.VehicleService.Services.VehicleHealthService;
import com.example.VehicleService.Services.VehicleService;
import com.example.VehicleService.Utils.UtilRecords;
import com.example.VehicleService.Utils.VehicleEnums;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "rabbitMq", matchIfMissing = true)
public class RabbitMqReceiverService {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);

    // Queue Names
    private static final String QUEUE_DISPATCH_CREATED = "vehicle.service.created.dispatch.queue";
    private static final String QUEUE_DISPATCH_COMPLETED = "completed.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service";
    private static final String QUEUE_DISPATCH_FROM_LOGS = "completed.dispatch.fanOut.provider.logs.queue.service.vehicle";



    private final String DISPATCH_VALIDATED_FANOUT_VEHICLE_QUEUE = "validated.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service";
    private static final String QUEUE_DISPATCH_TRACKING = "start.tracking.fanOut.provider.logs.queue.vehicle";
    private static final String QUEUE_VEHICLE_LOCATION = "tracking.checkPoint.fanOut.provider.logs.queue.vehicle.service";



    private final VehicleService vehicleService;

    public RabbitMqReceiverService(VehicleService vehicleService) {

        this.vehicleService = vehicleService;
    }


    /**
     * Handles new dispatch creation to vehicle.
     * Updates dispatch status to PENDING and triggers health evaluation.
     */
    @Transactional
    @RabbitListener(queues = QUEUE_DISPATCH_CREATED)
    public Map<String, Object> handleDispatchToVehicle(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
        try {

            return vehicleService.handleDispatchRequest(dispatchEvent);

        } catch (Exception e) {
            logger.error("Error processing dispatch creation event", e);
            return null;
        }
    }

    /**
     * Handles completed dispatch from dispatch service.
     */
    @Transactional
    @RabbitListener(queues = QUEUE_DISPATCH_COMPLETED)
    public void handleDispatchCompletedFromDispatch(UtilRecords.DispatchEndedDTO dispatchEvent) {
        try {
            vehicleService.completedDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing completed dispatch (dispatch service)", e);
        }
    }

    /**
     * Handles completed dispatch from logs service.
     */
    @Transactional
    @RabbitListener(queues = QUEUE_DISPATCH_FROM_LOGS)
    public void handleDispatchCompletedFromLogs(UtilRecords.DispatchEndedDTO dispatchEvent) {
        try {
            vehicleService.completedDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing completed dispatch (logs service)", e);
        }
    }

    /**
     * Handles validated dispatch events.
     */
    @RabbitListener(queues = DISPATCH_VALIDATED_FANOUT_VEHICLE_QUEUE)
    public void handleDispatchValidated(UtilRecords.ValidatedDispatch dispatchEvent) {
        try {
            vehicleService.handleValidatedDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing validated dispatch event", e);
        }
    }

    /**
     * Handles dispatch tracking notifications.
     */
    @Transactional
    @RabbitListener(queues = QUEUE_DISPATCH_TRACKING)
    public void handleDispatchTracking(UtilRecords.StartTrackingDTO trackingEvent) {
        if (trackingEvent == null || trackingEvent.dispatchId() == null) {
            logger.warn("Received invalid tracking event: {}", trackingEvent);
            return;
        }

        try {
            logger.info("Received tracking notification: {}", trackingEvent);
            vehicleService.handleDispatchTracking(trackingEvent);
        } catch (Exception e) {
            logger.error("Error processing dispatch tracking event", e);
        }
    }

    /**
     * Handles vehicle dispatch location updates.
     */
    @Transactional
    @RabbitListener(queues = QUEUE_VEHICLE_LOCATION)
    public void handleVehicleLocationUpdate(UtilRecords.vehicleLocationUpdate update) {
        if (update == null || update.vehicleIdentificationNumber() == null) {
            logger.warn("Received invalid vehicle location update.");
            return;
        }

        try {
            vehicleService.handleVehicleLocationUpdate(update);
        } catch (Exception e) {
            logger.error("Error processing vehicle location update", e);
        }
    }



}
