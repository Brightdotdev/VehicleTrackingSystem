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

    public TrackingService(MessagingService messagingService, TrackingRepository trackingRepository, UserHandler userHandler) {
        this.messagingService = messagingService;
        this.trackingRepository = trackingRepository;
        this.userHandler = userHandler;
    }

    /**
     * Revalidates tracking for a dispatch, updates checkpoint, completes if ended, and sends notifications.
     */
    @Transactional
    public TrackingModel revalidateTrackingPosition(Long dispatchId, UtilRecords.CheckPoint checkPoint) {
        TrackingModel model = findTrackingOrThrow(dispatchId, userHandler.getCurrentUser());

        if (hasDispatchEnded(model)) {
            completeDispatch(model);
            // No flush() needed; save() persists immediately.
            messagingService.sendCompletedDispatchFanOut(buildDispatchEndedDTO(model));
        }

        updateCheckpoint(model, checkPoint);
        messagingService.sendTrackingCheckPointFanOut(buildVehicleLocationUpdate(model, checkPoint));

        return model;
    }

    /**
     * Starts tracking a dispatch at a given checkpoint.
     */
    @Transactional
    public TrackingModel startTracking(Long dispatchId, UtilRecords.CheckPoint checkPoint) {
        TrackingModel model = findTrackingOrThrow(dispatchId, userHandler.getCurrentUser());
        validateTrackingStart(model);

        model.setCurrentLocation(checkPoint);
        model.setDispatchStatus(LogEnums.DispatchStatus.ONGOING);
        trackingRepository.save(model);

        messagingService.sendTrackingInitializationFanout(buildStartTrackingDTO(dispatchId, model));
        messagingService.sendTrackingCheckPointFanOut(buildVehicleLocationUpdate(model, checkPoint));

        return model;
    }

    /**
     * Stops tracking a dispatch, sets status based on cancel flag, and sends notification.
     */
    @Transactional
    public void stopTracking(UtilRecords.DispatchEndedDTO dispatchEvent) {
        TrackingModel model = findTrackingOrThrow(dispatchEvent.dispatchId(), dispatchEvent.receiver());

        model.setDispatchStatus(dispatchEvent.wasCancelled() ? LogEnums.DispatchStatus.CANCELLED : LogEnums.DispatchStatus.COMPLETED);
        model.setEndedAt(LocalDateTime.now());
        trackingRepository.save(model);

        messagingService.sendCompletedDispatchFanOut(dispatchEvent);
    }

    /**
     * Find tracking by dispatch ID for current user.
     */
    @Transactional
    public TrackingModel findByDispatchId(Long dispatchID) {
        return findTrackingOrThrow(dispatchID, userHandler.getCurrentUser());
    }

    /**
     * Updates tracking model when dispatch is validated.
     */
    @Transactional
    public void handleValidatedDispatchTracking(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {
        TrackingModel model = trackingRepository
                .findByDispatchIdAndDispatchRequester(dispatchValidatedEvent.dispatchId(), dispatchValidatedEvent.dispatchRequester())
                .orElseThrow(() -> new NotFoundException("No initialized dispatch tracker for dispatchId: " + dispatchValidatedEvent.dispatchId()));

        model.setDispatchAdmin(dispatchValidatedEvent.dispatchAdmin());
        trackingRepository.save(model);
    }

    /**
     * Initializes tracking when dispatch is created.
     */
    @Transactional
    public void handleDispatchTrackingInitialisation(UtilRecords.dispatchRequestBodyDTO dispatchCreatedEvent) {
        TrackingModel model = new TrackingModel();

        model.setDispatchId(dispatchCreatedEvent.dispatchId());
        model.setCreatedAt(LocalDateTime.now());
        model.setDispatchReason(dispatchCreatedEvent.dispatchReason());
        model.setDispatchEndTime(dispatchCreatedEvent.dispatchEndTime());
        model.setDispatchStatus(LogEnums.DispatchStatus.IN_PROGRESS);
        model.setVehicleIdentificationNumber(dispatchCreatedEvent.vehicleIdentificationNumber());
        model.setDispatchRequester(dispatchCreatedEvent.dispatchRequester());
        model.setVehicleName(dispatchCreatedEvent.vehicleName());

        trackingRepository.save(model);
    }

    /* =========================
       Private Helper Methods
       ========================= */

    private TrackingModel findTrackingOrThrow(Long dispatchId, String requester) {
        return trackingRepository
                .findFirstByDispatchIdAndDispatchRequester(dispatchId, requester)
                .orElseThrow(() -> new NotFoundException("Tracking record not found for dispatchId: " + dispatchId + ", requester: " + requester));
    }

    private boolean hasDispatchEnded(TrackingModel model) {
        return model.getDispatchEndTime() != null && LocalDateTime.now().isAfter(model.getDispatchEndTime());
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
        if (!LogEnums.DispatchStatus.IN_PROGRESS.equals(status)) {
            throw new ConflictException("Cannot start tracking. Dispatch status is: " + status);
        }
    }

    /* =========================
       DTO Builders
       ========================= */

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

