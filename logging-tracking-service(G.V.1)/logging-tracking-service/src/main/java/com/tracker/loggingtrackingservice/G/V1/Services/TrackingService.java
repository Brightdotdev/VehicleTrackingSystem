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

    public TrackingModel revalidateTracking(Long dispatchId, UtilRecords.CheckPoint checkPoint) {

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
            UtilRecords.DispatchEndedDTO completedEvent = new UtilRecords.DispatchEndedDTO(
                    false,LocalDateTime.now(), model.getVehicleIdentificationNumber(), model.getDispatchRequester(), model.getVehicleName(), model.getDispatchId()
            );
            rabbitMqSenderService.sendCompletedDispatchFanOut(completedEvent);
        }
        model.addToCheckPoint(model.getCurrentLocation());
        model.setCurrentLocation(checkPoint);
        return model;
    }


    public TrackingModel startTracking(Long dispatchId, UtilRecords.ValidatedDispatch validatedDispatch, UtilRecords.CheckPoint checkPoint) {
       TrackingModel trackingModel = new TrackingModel();
       trackingModel.setDispatchStatus(LogEnums.DispatchStatus.IN_PROGRESS);
       trackingModel.setCurrentLocation(checkPoint);
       trackingModel.setDispatchedBy(validatedDispatch.dispatchAdmin());
       trackingModel.setVehicleIdentificationNumber(validatedDispatch.vehicleIdentificationNumber());
       trackingModel.setDispatchRequester(validatedDispatch.dispatchRequester());
       trackingModel.setVehicleName(validatedDispatch.vehicleName());
        return trackingModel;
    }

    public void stopTracking(UtilRecords.DispatchEndedDTO dispatchEvent) {
        Optional<TrackingModel> trackingModel = trackingRepository.findByDispatchId(dispatchEvent.dispatchId());

        if (trackingModel.isEmpty()) {
            throw new NotFoundException("Tracking record not found");
        }

        TrackingModel model = trackingModel.get();
        if(dispatchEvent.wasCancelled()){
            model.setDispatchStatus(LogEnums.DispatchStatus.CANCELLED);
        }
        model.setDispatchStatus(LogEnums.DispatchStatus.COMPLETED);
        model.setEndedAt(LocalDateTime.now());
       trackingRepository.save(model);
        System.out.println("yup it's successfully cancelled");
    }
}
