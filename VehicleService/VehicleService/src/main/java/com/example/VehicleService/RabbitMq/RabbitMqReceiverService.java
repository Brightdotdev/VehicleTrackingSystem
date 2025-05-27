package com.example.VehicleService.RabbitMq;


import com.example.VehicleService.Exceptions.NotFoundException;
import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Repositories.VehicleRepository;
import com.example.VehicleService.Services.VehicleHealthService;
import com.example.VehicleService.Services.VehicleService;
import com.example.VehicleService.Utils.UtilRecords;
import com.example.VehicleService.Utils.VehicleEnums;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class RabbitMqReceiverService {

    private final String DISPATCH_COMPLETED_FANOUT_VEHICLE_QUEUE = "completed.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service";

    private final String DISPATCH_CREATED_DIRECT_EXCHANGE_QUEUE = "vehicle.service.created.dispatch.queue";
    private final String END_DISPATCH_FAN_OUT_QUEUE_VEHICLE =  "end.dispatch.service.vehicle";


    private final String DISPATCH_VALIDATED_FAN_OUT_QUEUE_VEHICLE = "dispatch.validated.queue.service.vehicle";

    private final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);
    private final VehicleRepository vehicleRepository;
    private final VehicleHealthService vehicleHealthService;

    private final VehicleService vehicleService;

    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    public RabbitMqReceiverService(VehicleRepository vehicleRepository, VehicleHealthService vehicleHealthService, VehicleService vehicleService) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleHealthService = vehicleHealthService;
        this.vehicleService = vehicleService;
    }


    @Transactional
    @RabbitListener(queues = DISPATCH_CREATED_DIRECT_EXCHANGE_QUEUE)
    public Map<String, Object> handleDispatchToVehicleQueue(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
        try {
            VehicleModel vehicle = vehicleRepository.findByVehicleIdentificationNumber(dispatchEvent.vehicleIdentificationNumber());

            if (vehicle == null) {
                throw new NotFoundException("Vehicle not found for VIN: " + dispatchEvent.vehicleIdentificationNumber());
            }

            vehicle.setDispatchStatus(VehicleEnums.VehicleDispatchStatus.PENDING);
            vehicleRepository.save(vehicle);

            Hibernate.initialize(vehicle.getDispatchHistory());

            return vehicleHealthService.vehicleDispatchStatus(vehicle);

        } catch (Exception e) {
            logger.error("Error processing dispatch message: {}", e.getMessage(), e);
            return null;
        }
    }

    @Transactional
    @RabbitListener(queues = DISPATCH_COMPLETED_FANOUT_VEHICLE_QUEUE)
    public void
    handleDispatchToVehicleQueue(UtilRecords.DispatchEndedDTO dispatchEvent) {
        try {
            vehicleService.completedDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing dispatch message for fanout queue for complete dispatch: {}", e.getMessage());
        }
    }



    @RabbitListener(queues = DISPATCH_VALIDATED_FAN_OUT_QUEUE_VEHICLE)
    public void
    handleDispatchValidatedQueue(UtilRecords.ValidatedDispatch dispatchEvent) {
        try {
            vehicleService.handleValidatedDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing dispatch for validation: {}", e.getMessage());
        }
    }




    @Transactional
    @RabbitListener(queues = END_DISPATCH_FAN_OUT_QUEUE_VEHICLE)
    public void
    handleDispatchCreatedOrCancelled(UtilRecords.DispatchEndedDTO dispatchEvent) {
        try {
            vehicleService.completedDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing completed dispatch dispatch message: {}", e.getMessage());
        }
    }
}
