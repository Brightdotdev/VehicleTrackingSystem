package com.tracker.loggingtrackingservice.G.V1.Services;

import com.tracker.loggingtrackingservice.G.V1.Config.UserHandler;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.ConflictException;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.NotFoundException;
import com.tracker.loggingtrackingservice.G.V1.Models.TrackingModel;
import com.tracker.loggingtrackingservice.G.V1.Messaging.MessagingService;
import com.tracker.loggingtrackingservice.G.V1.Repositories.TrackingRepository;
import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service layer for managing tracking operations on dispatch records.
 *
 * Responsibilities:
 * - Start, stop, and revalidate tracking
 * - Handle initialization and validation events
 * - Update tracking checkpoints and statuses
 *
 * All methods run within a transactional boundary.
 */
@Service
public class TrackingService {

    private final UserHandler userHandler;
    private final MessagingService messagingService;
    private final TrackingRepository trackingRepository;
    private static final Logger logger = LoggerFactory.getLogger(TrackingService.class);

    public TrackingService(
            MessagingService messagingService,
            TrackingRepository trackingRepository,
            UserHandler userHandler
    ) {
        this.messagingService = messagingService;
        this.trackingRepository = trackingRepository;
        this.userHandler = userHandler;
    }

    /**
     * Revalidates the tracking position of an ongoing dispatch.
     *
     * @param dispatchId the ID of the dispatch to revalidate
     * @param checkPoint new checkpoint location
     * @return updated TrackingModel with new location and status if completed
     */
    @Transactional
    public TrackingModel revalidateTrackingPosition(Long dispatchId, UtilRecords.CheckPoint checkPoint) {
        TrackingModel model = findTrackingOrThrow(dispatchId, userHandler.getCurrentUser());

        // If dispatch has ended, mark as completed and notify
        if (hasDispatchEnded(model)) {
            completeDispatch(model);
            trackingRepository.flush(); // commit before sending completion event
            messagingService.sendCompletedDispatchFanOut(buildDispatchEndedDTO(model));
        }

        // Update checkpoint location
        updateCheckpoint(model, checkPoint);
        trackingRepository.flush(); // commit before sending location update
        messagingService.sendTrackingCheckPointFanOut(buildVehicleLocationUpdate(model, checkPoint));

        return model;
    }

    /**
     * Starts tracking for a given dispatch.
     *
     * @param dispatchId the ID of the dispatch to start tracking
     * @param checkPoint initial checkpoint location
     * @return updated TrackingModel in ONGOING status
     */
    @Transactional
    public TrackingModel startTracking(Long dispatchId, UtilRecords.CheckPoint checkPoint) {
        TrackingModel trackingModel = findTrackingOrThrow(dispatchId, userHandler.getCurrentUser());
        validateTrackingStart(trackingModel);

        trackingModel.setCurrentLocation(checkPoint);
        trackingModel.setDispatchStatus(LogEnums.DispatchStatus.ONGOING);

        trackingRepository.save(trackingModel);
        trackingRepository.flush(); // commit before sending tracking events

        // Notify about tracking start and initial location
        messagingService.sendTrackingInitializationFanout(buildStartTrackingDTO(dispatchId, trackingModel));
        messagingService.sendTrackingCheckPointFanOut(buildVehicleLocationUpdate(trackingModel, checkPoint));

        return trackingModel;
    }

    /**
     * Stops tracking for a given dispatch.
     *
     * @param dispatchEvent DTO containing details about the dispatch stop event
     */
    @Transactional
    public void stopTracking(UtilRecords.DispatchEndedDTO dispatchEvent) {
        TrackingModel model = findTrackingOrThrow(dispatchEvent.dispatchId(), userHandler.getCurrentUser());

        model.setDispatchStatus(dispatchEvent.wasCancelled()
                ? LogEnums.DispatchStatus.CANCELLED
                : LogEnums.DispatchStatus.COMPLETED);

        model.setEndedAt(LocalDateTime.now());

        trackingRepository.save(model);
        trackingRepository.flush(); // commit before sending stop event

        messagingService.sendCompletedDispatchFanOut(dispatchEvent);
    }

    /**
     * Finds a tracking record by dispatch ID for the current user.
     *
     * @param dispatchID dispatch identifier
     * @return TrackingModel if found, otherwise throws NotFoundException
     */
    @Transactional
    public TrackingModel findByDispatchId(Long dispatchID) {
        return findTrackingOrThrow(dispatchID, userHandler.getCurrentUser());
    }

    /**
     * Updates tracking model after a dispatch is validated.
     *
     * @param dispatchValidatedEvent DTO containing validated dispatch details
     */
    @Transactional
    public void handleValidatedDispatchTracking(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {
        TrackingModel trackingModel = trackingRepository
                .findByDispatchIdAndDispatchRequester(dispatchValidatedEvent.dispatchId(), dispatchValidatedEvent.dispatchRequester())
                .orElseThrow(() -> new NotFoundException("No initialized dispatch tracker for this dispatch"));

        trackingModel.setDispatchAdmin(dispatchValidatedEvent.dispatchAdmin());
        trackingRepository.save(trackingModel);
    }

    /**
     * Initializes a new tracking model for a created dispatch.
     *
     * @param dispatchCreatedEvent DTO containing newly created dispatch details
     */
    @Transactional
    public void handleDispatchTrackingInitialisation(UtilRecords.dispatchRequestBodyDTO dispatchCreatedEvent) {
        TrackingModel trackingModel = new TrackingModel();

        trackingModel.setDispatchId(dispatchCreatedEvent.dispatchId());
        trackingModel.setCreatedAt(LocalDateTime.now());
        trackingModel.setDispatchReason(dispatchCreatedEvent.dispatchReason());
        trackingModel.setDispatchEndTime(dispatchCreatedEvent.dispatchEndTime());
        trackingModel.setDispatchStatus(LogEnums.DispatchStatus.IN_PROGRESS);
        trackingModel.setVehicleIdentificationNumber(dispatchCreatedEvent.vehicleIdentificationNumber());
        trackingModel.setDispatchRequester(dispatchCreatedEvent.dispatchRequester());
        trackingModel.setVehicleName(dispatchCreatedEvent.vehicleName());

        trackingRepository.save(trackingModel);
    }

    /* ===========================
       Private Helper Methods
       =========================== */

    private TrackingModel findTrackingOrThrow(Long dispatchId, String requester) {
        return trackingRepository
                .findFirstByDispatchIdAndDispatchRequester(dispatchId, requester)
                .orElseThrow(() -> new NotFoundException("Tracking record not found"));
    }

    private boolean hasDispatchEnded(TrackingModel model) {
        return model.getDispatchEndTime() != null &&
                LocalDateTime.now().isAfter(model.getDispatchEndTime());
    }

    private void completeDispatch(TrackingModel model) {
        model.setDispatchStatus(LogEnums.DispatchStatus.COMPLETED);
        model.setEndedAt(LocalDateTime.now());
        trackingRepository.save(model);
    }

    private void updateCheckpoint(TrackingModel model, UtilRecords.CheckPoint checkPoint) {
        model.addToCheckPoint(model.getCurrentLocation());
        model.setCurrentLocation(checkPoint);
        trackingRepository.save(model);
    }

    private void validateTrackingStart(TrackingModel model) {
        LogEnums.DispatchStatus status = model.getDispatchStatus();
        if (!status.equals(LogEnums.DispatchStatus.IN_PROGRESS)) {
            throw new ConflictException("The dispatch is not in progress for tracking");
        }
        if (status.equals(LogEnums.DispatchStatus.COMPLETED)) {
            throw new ConflictException("The dispatch is Completed");
        }
        if (status.equals(LogEnums.DispatchStatus.CANCELLED)) {
            throw new ConflictException("The dispatch is Cancelled");
        }
    }

    /* ===========================
       DTO Builders
       =========================== */

    private UtilRecords.DispatchEndedDTO buildDispatchEndedDTO(TrackingModel model) {
        return new UtilRecords.DispatchEndedDTO(
                false,
                LocalDateTime.now(),
                model.getVehicleIdentificationNumber(),
                model.getDispatchRequester(),
                model.getVehicleName(),
                model.getDispatchId()
        );
    }

    private UtilRecords.vehicleLocationUpdate buildVehicleLocationUpdate(TrackingModel model, UtilRecords.CheckPoint checkPoint) {
        return new UtilRecords.vehicleLocationUpdate(checkPoint, model.getVehicleIdentificationNumber());
    }

    private UtilRecords.StartTrackingDTO buildStartTrackingDTO(Long dispatchId, TrackingModel model) {
        return new UtilRecords.StartTrackingDTO(
                dispatchId,
                model.getVehicleName(),
                model.getDispatchReason(),
                model.getVehicleIdentificationNumber(),
                model.getDispatchRequester(),
                model.getDispatchAdmin()
        );
    }
}
