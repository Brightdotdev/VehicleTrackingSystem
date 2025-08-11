package com.example.DispatchService.Service;

import com.example.DispatchService.Exceptions.ConflictException;
import com.example.DispatchService.Exceptions.InvalidRequestException;
import com.example.DispatchService.Exceptions.NotFoundException;
import com.example.DispatchService.Messaging.MessagingService;
import com.example.DispatchService.Models.DispatchModel;
import com.example.DispatchService.Repositories.DispatchRepository;
import com.example.DispatchService.Utils.DispatchEnums;
import com.example.DispatchService.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.example.DispatchService.Utils.DispatchEnums.DispatchStatus.*;

/**
 * Service that handles admin-related dispatch operations such as validation,
 * cancellation, and revalidation of dispatches.
 */
@Service
public class AdminDispatchService {

    private final DispatchRepository dispatchRepository;
    private final MessagingService messagingService;

    
    static double costPerDay = 500;

    public AdminDispatchService(DispatchRepository dispatchRepository, MessagingService messagingService) {
        this.dispatchRepository = dispatchRepository;
        this.messagingService = messagingService;
    }

    /**
     * Validates a dispatch by an admin. Only users with ROLE_ADMIN can perform this.
     *
     * @param adminEmail Admin performing the validation
     * @param userRole List of user roles
     * @param dispatchId ID of the dispatch to validate
     * @return Updated DispatchModel after validation
     * @throws InvalidRequestException if user role is missing or invalid
     * @throws NotFoundException if dispatch does not exist
     * @throws ConflictException if dispatch is no longer valid
     */
    @Transactional
    public DispatchModel validateDispatch(String adminEmail, List<String> userRole, Long dispatchId) {
        validateAdminRole(userRole);

        DispatchModel dispatch = findDispatchOrThrow(dispatchId);

        if (!isStillValidDispatch(dispatch)) {
            return null;  // Dispatch expired or invalid
        }

        // Update dispatch with admin info and new status
        dispatch.setDispatchAdmin(adminEmail);
        dispatch.setDispatchStatus(IN_PROGRESS);
        dispatch.setDispatchRequestApproveTime(LocalDateTime.now());

        // Prepare validated dispatch broadcast event
        UtilRecords.ValidatedDispatch validatedDispatch = new UtilRecords.ValidatedDispatch(
                dispatch.getDispatchId(),
                dispatch.getVehicleName(),
                dispatch.getDispatchReason(),
                dispatch.getDispatchVehicleId(),
                dispatch.getDispatchRequester(),
                dispatch.getDispatchAdmin(),
                dispatch.getDispatchEndTime()
        );

        messagingService.sendDispatchValidatedNoResponse(validatedDispatch);

        return dispatchRepository.save(dispatch);
    }

    /**
     * Cancels a dispatch by an admin. Only ONGOING, PENDING, or IN_PROGRESS dispatches can be cancelled.
     *
     * @param adminEmail Admin performing cancellation
     * @param userRole List of user roles
     * @param dispatchId Dispatch ID to cancel
     * @param dispatchCancelReason Reason for cancellation
     * @return Updated DispatchModel after cancellation
     * @throws InvalidRequestException if user role invalid or dispatch status disallows cancellation
     * @throws NotFoundException if dispatch not found
     * @throws ConflictException if dispatch is invalid
     */
    @Transactional
    public DispatchModel cancelDispatch(String adminEmail, List<String> userRole, Long dispatchId, String dispatchCancelReason) {
        validateAdminRole(userRole);

        DispatchModel dispatch = findDispatchOrThrow(dispatchId);

        if (!isStillValidDispatch(dispatch)) {
            return null;  // Dispatch expired or invalid
        }

        dispatch.setDispatchAdmin(adminEmail);

        // Handle refund and messaging differently depending on dispatch status
        switch (dispatch.getDispatchStatus()) {
            case ONGOING -> {
                // Calculate partial refund for ongoing dispatch
                Double refundAmount = calculateOngoingRefund(dispatch);

                // Notify score update with refund
                UtilRecords.DispatchScoreUpdateDto scoreUpdate = new UtilRecords.DispatchScoreUpdateDto(
                        dispatch.getDispatchRequester(),
                        dispatchId,
                        refundAmount
                );
                messagingService.updateUserScore(scoreUpdate);

                dispatch.setDispatchStatus(CANCELLED);

                // Notify dispatch ended (cancelled)
                notifyDispatchEnded(dispatch, true);

                return dispatchRepository.save(dispatch);
            }
            case PENDING, IN_PROGRESS -> {
                // Full refund for pending or in-progress dispatches
                Double fullRefund = dispatch.getDispatchCost();

                UtilRecords.DispatchScoreUpdateDto scoreUpdate = new UtilRecords.DispatchScoreUpdateDto(
                        dispatch.getDispatchRequester(),
                        dispatchId,
                        fullRefund
                );
                messagingService.updateUserScore(scoreUpdate);

                dispatch.setDispatchStatus(CANCELLED);

                // Notify dispatch ended (cancelled)
                notifyDispatchEnded(dispatch, true);

                return dispatchRepository.save(dispatch);
            }
            default -> throw new InvalidRequestException(
                    "Only ONGOING, PENDING or IN_PROGRESS dispatches can be cancelled by the user", 400);
        }
    }

    /**
     * Revalidates all active dispatches. Expires those past their end time and handles refunds.
     *
     * @return List of currently active dispatches after revalidation
     */
    @Transactional
    public List<DispatchModel> revalidateAllActiveDispatch() {
        List<DispatchModel> allDispatches = dispatchRepository.findAll();
        List<DispatchModel> activeDispatches = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();

        for (DispatchModel dispatch : allDispatches) {
            if (isDispatchFinalized(dispatch)) {
                // Skip completed, cancelled, expired
                continue;
            }

            if (dispatch.getDispatchEndTime().isBefore(now)) {
                expireDispatchIfNeeded(dispatch,LocalDateTime.now());
            } else {
                activeDispatches.add(dispatch);
            }
        }

        dispatchRepository.saveAll(allDispatches);

        return activeDispatches;
    }

    /**
     * Revalidates all dispatches - expires any dispatch past end time and processes refunds.
     *
     * @return Updated list of all dispatches after revalidation
     */
    @Transactional
    public List<DispatchModel> revalidateAllDispatch() {
        List<DispatchModel> allDispatches = dispatchRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (DispatchModel dispatch : allDispatches) {
            if (!isDispatchFinalized(dispatch) && dispatch.getDispatchEndTime().isBefore(now)) {
                    expireDispatchIfNeeded(dispatch, LocalDateTime.now());

            }
        }

        return dispatchRepository.saveAll(allDispatches);
    }

    /**
     * Revalidates a specific dispatch by ID and vehicle ID.
     * Expires if past end time and processes refund if applicable.
     *
     * @param dispatchId Dispatch ID
     * @param vehicleId Vehicle ID
     * @return Updated dispatch model
     * @throws NotFoundException if dispatch not found
     */
    @Transactional
    public DispatchModel revalidateDispatchByIdAndVehicleId(@Valid Long dispatchId, String vehicleId) {
        DispatchModel dispatch = dispatchRepository.findByDispatchIdAndDispatchVehicleId(dispatchId, vehicleId);

        if (dispatch == null) {
            throw new NotFoundException("Dispatch Not found");
        }

        LocalDateTime now = LocalDateTime.now();

        if (dispatch.getDispatchEndTime().isBefore(now)) {

               expireDispatchIfNeeded(dispatch,LocalDateTime.now());
                 return dispatchRepository.save(dispatch);
        } else {
            return dispatch;
        }
    }

    /**
     * Retrieves all dispatch history for a given vehicle ID.
     *
     * @param vehicleId Vehicle identification string
     * @return List of dispatch models for the vehicle
     */
    public List<DispatchModel> getVehicleHistory(String vehicleId) {
        return dispatchRepository.findByDispatchVehicleId(vehicleId);
    }

    /* =====================
       Private Helper Methods
       ===================== */

    // Helper: validates that user has ROLE_ADMIN, else throws exception
    private void validateAdminRole(List<String> userRole) {
        if (userRole.isEmpty()) {
            throw new InvalidRequestException("No user role provided", 400);
        }
        if (!userRole.contains("ROLE_ADMIN")) {
            throw new InvalidRequestException("Not a valid user for this request", 400);
        }
    }

    // Helper: finds dispatch or throws NotFoundException
    private DispatchModel findDispatchOrThrow(Long dispatchId) {
        DispatchModel dispatch = dispatchRepository.findByDispatchId(dispatchId);
        if (dispatch == null) {
            throw new NotFoundException("Dispatch not found");
        }
        return dispatch;
    }

    // Checks if dispatch is finalized (COMPLETED, CANCELLED, EXPIRED)
    private boolean isDispatchFinalized(DispatchModel dispatch) {
        return dispatch.getDispatchStatus() == COMPLETED
                || dispatch.getDispatchStatus() == CANCELLED
                || dispatch.getDispatchStatus() == EXPIRED;
    }

    /**
     * Checks if the dispatch is valid (not expired, cancelled, or completed),
     * else throws ConflictException.
     *
     * @param dispatch DispatchModel to check
     * @return true if valid
     */
    private boolean isStillValidDispatch(DispatchModel dispatch) {
        if (dispatch == null) {
            throw new IllegalArgumentException("Dispatch cannot be null");
        }

        switch (dispatch.getDispatchStatus()) {
            case EXPIRED -> throw new ConflictException("Dispatch is expired");
            case CANCELLED -> throw new ConflictException("Dispatch is cancelled");
            case COMPLETED -> throw new ConflictException("Dispatch is completed");
        }

        if (dispatch.getDispatchEndTime() == null) {
            throw new ConflictException("Dispatch end time is not set");
        }

        if (dispatch.getDispatchEndTime().isBefore(LocalDateTime.now())) {
            throw new ConflictException("Dispatch has already ended");
        }

        return true;
    }

    /**
     * Helper to send a dispatch ended notification with cancellation flag.
     *
     * @param dispatch DispatchModel
     * @param wasCancelled true if dispatch was cancelled, false if expired normally
     */
    private void notifyDispatchEnded(DispatchModel dispatch, boolean wasCancelled) {
        UtilRecords.DispatchEndedDTO dispatchEnded = new UtilRecords.DispatchEndedDTO(
                wasCancelled,
                LocalDateTime.now(),
                dispatch.getDispatchVehicleId(),
                dispatch.getDispatchRequester(),
                dispatch.getVehicleName(),
                dispatch.getDispatchId()
        );
        messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);
    }



    /**
     * Calculates the refund amount for an ongoing dispatch based on unused time.
     *
     * @param dispatch DispatchModel currently ongoing
     * @return refundable amount
     */
    public Double calculateOngoingRefund(DispatchModel dispatch) {
        LocalDateTime startTime = dispatch.getDispatchStartTime();
        LocalDateTime cancelTime = LocalDateTime.now();
        LocalDateTime endTime = dispatch.getDispatchEndTime();

        if (startTime == null || endTime == null) return 0.0;
        if (cancelTime.isAfter(endTime)) return 0.0;
        if (cancelTime.isBefore(startTime)) return 0.0;

        long totalDurationMinutes = Duration.between(startTime, endTime).toMinutes();
        long remainingMinutes = Duration.between(cancelTime, endTime).toMinutes();

        if (totalDurationMinutes <= 0 || remainingMinutes <= 0) return 0.0;

        double unusedRatio = (double) remainingMinutes / totalDurationMinutes;

        long totalHours = Duration.between(startTime, endTime).toHours();

        return getRefundable(dispatch, totalHours, unusedRatio);
    }

    /**
     * Helper method that calculates refundable amount based on vehicle class,
     * dispatch reason, and unused time ratio.
     *
     * @param dispatch DispatchModel
     * @param totalHours Total hours of dispatch
     * @param unusedRatio Portion of unused time (0.0 - 1.0)
     * @return refundable amount as double
     */
    private static double getRefundable(DispatchModel dispatch, long totalHours, double unusedRatio) {
        // Calculate half-day blocks (12 hours each)
        double halfDayBlocks = Math.ceil(totalHours / 12.0);
        double totalDays = halfDayBlocks * 0.5;

        double timeBasedCost = totalDays * costPerDay;

        // Assign flat fees based on vehicle class
        double flatFees = getFlatFees(dispatch);

        // Refundable flat fee portion (10%)
        double refundableFlat = flatFees * 0.1;

        // Total refundable amount is time-based unused cost + flat fee portion
        return (timeBasedCost * unusedRatio) + refundableFlat;
    }

    private static double getFlatFees(DispatchModel dispatch) {
        double vehicleClassScore = switch (dispatch.getVehicleClass()) {
            case CLASSIFIED -> 1000;
            case CARGO -> 300;
            case REGULAR -> 200;
            case TRANSPORT -> 400;
        };

        // Assign flat fees based on dispatch reason
        double dispatchReasonScore = switch (dispatch.getDispatchReason()) {
            case CLASSIFIED -> 1000;
            case DELIVERY -> 200;
            case TRANSPORT -> 150;
        };

        return vehicleClassScore + dispatchReasonScore;
    }




    /**
     * 1. If IN_PROGRESS or PENDING → refund.
     * 2. If ONGOING → mark as COMPLETED before expiring.
     * 3. Set status to EXPIRED and add metadata.
     * 4. Send dispatch ended fanout.
     */
    private void expireDispatchIfNeeded(DispatchModel dispatch, LocalDateTime now) {
        switch (dispatch.getDispatchStatus()) {
            case IN_PROGRESS:
            case PENDING:
                // Refund score for incomplete work
                UtilRecords.DispatchScoreUpdateDto refundDto = new UtilRecords.DispatchScoreUpdateDto(
                        dispatch.getDispatchRequester(),
                        dispatch.getDispatchId(),
                        dispatch.getDispatchCost()
                );
                messagingService.updateUserScore(refundDto);
                dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
                break;

            case ONGOING:
                dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.COMPLETED);
                break;

            default:
                break;
        }

        notifyDispatchEnded(dispatch,false);
    }


}
