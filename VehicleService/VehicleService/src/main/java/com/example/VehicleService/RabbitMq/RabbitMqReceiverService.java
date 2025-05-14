package com.example.VehicleService.RabbitMq;


import com.example.VehicleService.Exceptions.NotFoundException;
import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Repositories.VehicleRepository;
import com.example.VehicleService.Services.VehicleHealthService;
import com.example.VehicleService.Services.VehicleService;
import com.example.VehicleService.Utils.UtilRecords;
import com.fasterxml.jackson.databind.ObjectMapper;
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


    private final String COMPLETE_DISPATCH_FAN_OUT_QUEUE = "completed.dispatch.service.vehicle.fanOut";

    private final String VEHICLE_QUEUE = "vehicle.service.created.dispatch.queue";


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
    @RabbitListener(queues = VEHICLE_QUEUE)
    public Map<String, Object>
    handleDispatchToVehicleQueue(UtilRecords.dispatchRequestBody dispatchEvent) {
     try {
            VehicleModel vehicle = vehicleRepository.findByVehicleIdentificationNumber(dispatchEvent.vehicleIdentificationNumber());

            if (vehicle == null) {
                throw new NotFoundException("Vehicle not found for dispatch ID: " + dispatchEvent.vehicleIdentificationNumber());
            }

         return vehicleHealthService.vehicleDispatchStatus(vehicle);
        } catch (Exception e) {
            logger.error("Error processing dispatch message: {}", e.getMessage());
            return null;
        }
    }


    @Transactional
    @RabbitListener(queues = COMPLETE_DISPATCH_FAN_OUT_QUEUE)
    public void
    handleDispatchToVehicleQueue(UtilRecords.DispatchCompletedEvent dispatchEvent) {
        try {
            vehicleService.completeDispatch(dispatchEvent);
        } catch (Exception e) {
            logger.error("Error processing dispatch message: {}", e.getMessage());
        }
    }

}
