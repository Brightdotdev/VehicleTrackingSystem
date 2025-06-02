package com.tracker.loggingtrackingservice.G.V1.Services;


import com.tracker.loggingtrackingservice.G.V1.Exceptions.ConflictException;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.NotFoundException;
import com.tracker.loggingtrackingservice.G.V1.Models.TrackingModel;
import com.tracker.loggingtrackingservice.G.V1.RabbitMq.RabbitMqSenderService;
import com.tracker.loggingtrackingservice.G.V1.Repositories.NotificationRepository;
import com.tracker.loggingtrackingservice.G.V1.Repositories.TrackingRepository;
import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class TrackingService {



    private final RabbitMqSenderService rabbitMqSenderService;
    private final TrackingRepository trackingRepository;

    public TrackingService(RabbitMqSenderService rabbitMqSenderService, TrackingRepository trackingRepository, NotificationRepository notificationRepository) {
        this.rabbitMqSenderService = rabbitMqSenderService;
        this.trackingRepository = trackingRepository;
    }


    @Transactional
    public TrackingModel revalidateTrackingPosition(Long dispatchId, UtilRecords.CheckPoint checkPoint) {

        Optional<TrackingModel> trackingModel = trackingRepository.findByDispatchId(dispatchId);

        if (trackingModel.isEmpty()) {
            throw new NotFoundException("Tracking record not found");}

        TrackingModel model = trackingModel.get();


        if (model.getDispatchEndTime() != null &&
                LocalDateTime.now().isAfter(model.getDispatchEndTime())) {

            model.setDispatchStatus(LogEnums.DispatchStatus.COMPLETED);
            model.setEndedAt(LocalDateTime.now());

            UtilRecords.DispatchEndedDTO completedEvent = new UtilRecords.DispatchEndedDTO(
                    false,LocalDateTime.now(), model.getVehicleIdentificationNumber(), model.getDispatchRequester(), model.getVehicleName(), model.getDispatchId()
            );
            rabbitMqSenderService.sendCompletedDispatchFanOut(completedEvent);
            trackingRepository.save(model);
        }
        model.addToCheckPoint(model.getCurrentLocation());
        model.setCurrentLocation(checkPoint);
        return model;
    }


    @Transactional
    public TrackingModel startTracking(Long dispatchId, UtilRecords.CheckPoint checkPoint) {

        Optional<TrackingModel> foundValidatedTrackingModel = trackingRepository.findByDispatchId(dispatchId);

        if(foundValidatedTrackingModel.isEmpty()){
            throw new NotFoundException("No model saved for the current tracking or even an id for the tracking");
        }

        TrackingModel trackingModel = foundValidatedTrackingModel.get();

        if(!isValidToTrack(trackingModel)){
            return  null;
        }


        trackingModel.setCurrentLocation(checkPoint);
        trackingModel.setDispatchStatus(LogEnums.DispatchStatus.IN_PROGRESS);

        UtilRecords.StartTrackingDTO trackingDTO = new UtilRecords.StartTrackingDTO(dispatchId,trackingModel.getVehicleName(),trackingModel.getDispatchReason(),
                trackingModel.getVehicleIdentificationNumber(),trackingModel.getDispatchRequester(),trackingModel.getDispatchAdmin());

        rabbitMqSenderService.sendTrackingInitializationFanout(trackingDTO);


        trackingRepository.save(trackingModel);

       //im supposed to use rabbit mq here
        return trackingModel;
    }

    @Transactional
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

        rabbitMqSenderService.sendCompletedDispatchFanOut(dispatchEvent);

       trackingRepository.save(model);
        System.out.println("yup it's successfully cancelled");
    }


    @Transactional
    public TrackingModel findByDispatchId(Long dispatchID) {
        Optional<TrackingModel> trackingModel = trackingRepository.findByDispatchId(dispatchID);

        if (trackingModel.isEmpty()) {
            throw new NotFoundException("Tracking record not found");
        }
       return trackingModel.get();
    }


    @Transactional
    public void handleValidatedDispatchTracking(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {

        TrackingModel trackingModel = new TrackingModel();


        trackingModel.setDispatchId(dispatchValidatedEvent.dispatchId());
        trackingModel.setCreatedAt(LocalDateTime.now());
        trackingModel.setDispatchReason(dispatchValidatedEvent.dispatchReason());
        trackingModel.setDispatchEndTime(dispatchValidatedEvent.dispatchEndTime());

        trackingModel.setDispatchStatus(LogEnums.DispatchStatus.PENDING);
        trackingModel.setDispatchAdmin(dispatchValidatedEvent.dispatchAdmin());

        trackingModel.setVehicleIdentificationNumber(dispatchValidatedEvent.vehicleIdentificationNumber());

        trackingModel.setDispatchRequester(dispatchValidatedEvent.dispatchRequester());
        trackingModel.setVehicleName(dispatchValidatedEvent.vehicleName());

        trackingRepository.save(trackingModel);
    }


    //** utitiessss



    private boolean isValidToTrack(TrackingModel trackingModel){
        if(trackingModel.getDispatchStatus().equals(LogEnums.DispatchStatus.IN_PROGRESS)){
            throw new ConflictException("The dispatch is already staged for tracking");
        }

        if(trackingModel.getDispatchStatus().equals(LogEnums.DispatchStatus.COMPLETED)){
            throw new ConflictException("The dispatch is Completed");
        }
        if(trackingModel.getDispatchStatus().equals(LogEnums.DispatchStatus.CANCELLED)){
            throw new ConflictException("The dispatch is Cancelled");
        }
        return true;
    }
}
