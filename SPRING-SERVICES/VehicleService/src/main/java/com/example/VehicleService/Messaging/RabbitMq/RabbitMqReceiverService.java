package com.example.VehicleService.Messaging.RabbitMq;

import com.example.VehicleService.Messaging.ExceptionWrapper;
import com.example.VehicleService.Messaging.JsonMapper;
import com.example.VehicleService.Services.VehicleService;
import com.example.VehicleService.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static com.example.VehicleService.Messaging.ExceptionWrapper.wrapExceptions;

@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "rabbitMq", matchIfMissing = true)
public class RabbitMqReceiverService {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);

    private final JsonMapper jsonMapper;
    // Queue Names
    private static final String QUEUE_DISPATCH_CREATED = "vehicle.service.created.dispatch.queue";
    private static final String QUEUE_DISPATCH_COMPLETED = "completed.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service";
    private static final String QUEUE_DISPATCH_FROM_LOGS = "completed.dispatch.fanOut.provider.logs.queue.service.vehicle";



    private final String DISPATCH_VALIDATED_FANOUT_VEHICLE_QUEUE = "validated.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service";
    private static final String QUEUE_DISPATCH_TRACKING = "start.tracking.fanOut.provider.logs.queue.vehicle";
    private static final String QUEUE_VEHICLE_LOCATION = "tracking.checkPoint.fanOut.provider.logs.queue.vehicle.service";



    private final VehicleService vehicleService;

    public RabbitMqReceiverService(JsonMapper jsonMapper, VehicleService vehicleService) {
        this.jsonMapper = jsonMapper;
        this.vehicleService = vehicleService;
    }


    /**
     * Handles new dispatch creation to vehicle.
     * Updates dispatch status to PENDING and triggers health evaluation.
     */
    @Transactional
    @RabbitListener(queues = QUEUE_DISPATCH_CREATED)
    public Map<String, Object> handleDispatchToVehicle(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
        logger.info("📦 Received dispatch creation event: {}", jsonMapper.convertToJson(dispatchEvent));

        return ExceptionWrapper.handleAndReturn(() ->
                        vehicleService.handleDispatchRequest(dispatchEvent),
                logger,
                "handleDispatchToVehicle"
        );
    }

    /**
     * Handle dispatch completion from dispatch service.
     */
    @Transactional
    @RabbitListener(queues = QUEUE_DISPATCH_COMPLETED)
    public void handleDispatchCompletedFromDispatch(UtilRecords.DispatchEndedDTO dispatchEvent) {
        logger.info("📦 Received dispatch completed event from dispatch service: {}", jsonMapper.convertToJson(dispatchEvent));
        wrapExceptions(() -> {
            vehicleService.completedDispatch(dispatchEvent);
            return null;
        });
    }

    /**
     * Handle dispatch completion from logs service.
     */
    @Transactional
    @RabbitListener(queues = QUEUE_DISPATCH_FROM_LOGS)
    public void handleDispatchCompletedFromLogs(UtilRecords.DispatchEndedDTO dispatchEvent) {
        logger.info("📦 Received dispatch completed event from logs service: {}", jsonMapper.convertToJson(dispatchEvent));
        wrapExceptions(() -> {
            vehicleService.completedDispatch(dispatchEvent);
            return null;
        });
    }

    /**
     * Handle validated dispatch events.
     */
    @RabbitListener(queues = DISPATCH_VALIDATED_FANOUT_VEHICLE_QUEUE)
    public void handleDispatchValidated(UtilRecords.ValidatedDispatch dispatchEvent) {
        logger.info("📦 Received validated dispatch event: {}", jsonMapper.convertToJson(dispatchEvent));
        wrapExceptions(() -> {
            vehicleService.handleValidatedDispatch(dispatchEvent);
            return null;
        });
    }

    /**
     * Handle dispatch tracking events.
     */
    @Transactional
    @RabbitListener(queues = QUEUE_DISPATCH_TRACKING)
    public void handleDispatchTracking(UtilRecords.StartTrackingDTO trackingEvent) {
        logger.info("📦 Received dispatch tracking event: {}", jsonMapper.convertToJson(trackingEvent));
        if (trackingEvent == null || trackingEvent.dispatchId() == null) {
            logger.warn("⚠️ Invalid tracking event received: {}", trackingEvent);
            return;
        }

        wrapExceptions(() -> {
            vehicleService.handleDispatchTracking(trackingEvent);
            return null;
        });
    }

    /**
     * Handle vehicle location updates.
     */
    @Transactional
    @RabbitListener(queues = QUEUE_VEHICLE_LOCATION)
    public void handleVehicleLocationUpdate(UtilRecords.vehicleLocationUpdate update) {
        logger.info("📦 Received vehicle location update: {}", jsonMapper.convertToJson(update));
        if (update == null || update.vehicleIdentificationNumber() == null) {
            logger.warn("⚠️ Invalid vehicle location update received.");
            return;
        }

        wrapExceptions(() -> {
            vehicleService.handleVehicleLocationUpdate(update);
            return null;
        });
    }

}
