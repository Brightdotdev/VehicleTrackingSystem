package com.tracker.loggingtrackingservice.G.V1.Services;


import com.tracker.loggingtrackingservice.G.V1.Exceptions.NotFoundException;
import com.tracker.loggingtrackingservice.G.V1.Models.TrackingModel;
import com.tracker.loggingtrackingservice.G.V1.RabbitMq.RabbitMqSenderService;
import com.tracker.loggingtrackingservice.G.V1.Repositories.TrackingRepository;
import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class TrackingService {



    private final RabbitMqSenderService rabbitMqSenderService;
    private final TrackingRepository trackingRepository;

    public TrackingService(RabbitMqSenderService rabbitMqSenderService, TrackingRepository trackingRepository) {
        this.rabbitMqSenderService = rabbitMqSenderService;
        this.trackingRepository = trackingRepository;

    }


    public TrackingModel revalidateTracking(String dispatchId) {
        Optional<TrackingModel> trackingModel = trackingRepository.findByDispatchId(dispatchId);

        if (trackingModel.isEmpty()) {
            throw new NotFoundException("Tracking record not found");
        }

        TrackingModel model = trackingModel.get();


        if (model.getDispatchEndTime() != null &&
                LocalDateTime.now().isAfter(model.getDispatchEndTime())) {

            model.setDispatchStatus(LogEnums.DispatchStatus.COMPLETED);
            model.setEndedAt(LocalDateTime.now());

            trackingRepository.save(model);
            UtilRecords.DispatchCompletedEvent completedEvent = new UtilRecords

            .DispatchCompletedEvent(model.getVehicleIdentificationNumber(),model.getDispatchRequester(),model.getDispatchId(),LocalDateTime.now());


            rabbitMqSenderService.sendCompletedDispatchFanOut(completedEvent);
        }

        return model;
    }


    public TrackingModel startTracking(String dispatchId) {
        Optional<TrackingModel> trackingModel = trackingRepository.findByDispatchId(dispatchId);

        if (trackingModel.isEmpty()) {
            throw new NotFoundException("Tracking record not found");
        }

        TrackingModel model = trackingModel.get();


        if (model.getDispatchEndTime() != null &&
                LocalDateTime.now().isAfter(model.getDispatchEndTime())) {

            model.setDispatchStatus(LogEnums.DispatchStatus.COMPLETED);
            model.setEndedAt(LocalDateTime.now());

            trackingRepository.save(model);
            UtilRecords.DispatchCompletedEvent completedEvent = new UtilRecords

                    .DispatchCompletedEvent(model.getVehicleIdentificationNumber(),model.getDispatchRequester(),model.getDispatchId(),LocalDateTime.now());


            rabbitMqSenderService.sendCompletedDispatchFanOut(completedEvent);
        }

        return model;
    }
}
