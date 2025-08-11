package com.example.DispatchService.Service;

import com.example.DispatchService.Exceptions.ConflictException;
import com.example.DispatchService.Exceptions.InvalidRequestException;
import com.example.DispatchService.Exceptions.NotFoundException;
import com.example.DispatchService.Messaging.MessagingService;
import com.example.DispatchService.Messaging.ResponseMapperService;
import com.example.DispatchService.Models.DispatchModel;
import com.example.DispatchService.Repositories.DispatchRepository;
import com.example.DispatchService.Utils.DispatchEnums;
import com.example.DispatchService.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.example.DispatchService.Service.AdminDispatchService.costPerDay;
import static com.example.DispatchService.Utils.DispatchEnums.DispatchStatus.*;

/**
 * Full UserDispatchService — includes all user-facing methods (request, cancel, revalidation, tracking,
 * rating) plus shared expiry/refund logic to keep behavior consistent.
 */
@Service
public class UserDispatchService {

    private final DispatchRepository dispatchRepository;
    private final Logger logger = LoggerFactory.getLogger(UserDispatchService.class);
    private final ResponseMapperService dispatchResponseMapper;
    private final MessagingService messagingService;

    /**
     * Constructor injection for dependencies.
     */
    public UserDispatchService(DispatchRepository dispatchRepository,
                               ResponseMapperService dispatchResponseMapper,
                               MessagingService messagingService) {
        this.dispatchRepository = dispatchRepository;
        this.dispatchResponseMapper = dispatchResponseMapper;
        this.messagingService = messagingService;
    }

    /* ======================
       Helper: expiry & refund
       ====================== */

    /**
     * Centralized expiry logic used across all revalidation flows.
     *
     * Behavior:
     * - If status is IN_PROGRESS or PENDING => full refund, mark EXPIRED, add metadata, send fanout.
     * - If status is ONGOING => mark COMPLETED (dispatch finished normally), set end time, send fanout.
     * - Other statuses should be handled/checked by callers (method assumes caller only calls on non-finalized dispatches).
     *
     * @param dispatch the dispatch to process
     * @param user     associated username (used for fanout payload)
     * @param now      current time
     */
    private void expireOrCompleteDispatch(DispatchModel dispatch, String user, LocalDateTime now) {
        // If still staged/pending, user didn't use it — refund full cost and mark expired.
        if (dispatch.getDispatchStatus() == IN_PROGRESS || dispatch.getDispatchStatus() == PENDING) {
            UtilRecords.DispatchScoreUpdateDto refundDto = new UtilRecords.DispatchScoreUpdateDto(
                    dispatch.getDispatchRequester(),
                    dispatch.getDispatchId(),
                    dispatch.getDispatchCost()
            );
            messagingService.updateUserScore(refundDto);

            dispatch.setDispatchStatus(EXPIRED);
            dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Expired");

            UtilRecords.DispatchEndedDTO dispatchEnded = new UtilRecords.DispatchEndedDTO(
                    false,
                    now,
                    dispatch.getDispatchVehicleId(),
                    user,
                    dispatch.getVehicleName(),
                    dispatch.getDispatchId()
            );
            messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);

            return;
        }

        // If dispatch was ongoing (in-use) and time passed, it's effectively completed.
        if (dispatch.getDispatchStatus() == ONGOING) {
            dispatch.setDispatchStatus(COMPLETED);
            // Set end time to now if not already set (reflect actual completion)
            if (dispatch.getDispatchEndTime() == null || dispatch.getDispatchEndTime().isBefore(now)) {
                dispatch.setDispatchEndTime(now);
            }

            UtilRecords.DispatchEndedDTO dispatchEnded = new UtilRecords.DispatchEndedDTO(
                    false,
                    now,
                    dispatch.getDispatchVehicleId(),
                    user,
                    dispatch.getVehicleName(),
                    dispatch.getDispatchId()
            );
            messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);
        }

        // For other statuses (CANCELLED, COMPLETED, EXPIRED) callers should not call this helper.
    }

    /* ======================
       Public: request / cancel
       ====================== */

    /**
     * Handles a new vehicle dispatch request.
     * Validates vehicle availability, user score, calls external pricing & mapping services,
     * saves dispatch and updates user score (deduct).
     */
    @Transactional
    public DispatchModel requestVehicleDispatch(
            UtilRecords.dispatchRequestBody requestBody,
            String userName,
            String userImage,
            List<String> userRole) {

        logger.info("[DispatchRequest] Starting requestVehicleDispatch for user: {}", userName);

        // 1) Check for conflicting dispatches on the same vehicle
        List<DispatchModel> existingDispatches = dispatchRepository.findByDispatchVehicleId(requestBody.vehicleIdentificationNumber());
        for (DispatchModel dispatchModel : existingDispatches) {
            DispatchEnums.DispatchStatus status = dispatchModel.getDispatchStatus();

            if (status == DispatchEnums.DispatchStatus.COMPLETED ||
                    status == DispatchEnums.DispatchStatus.CANCELLED ||
                    status == DispatchEnums.DispatchStatus.EXPIRED) {
                continue; // no conflict
            }

            if (status == DispatchEnums.DispatchStatus.PENDING) {
                throw new InvalidRequestException("Vehicle already requested by another user", 403);
            }
            if (status == DispatchEnums.DispatchStatus.ONGOING) {
                throw new InvalidRequestException("Vehicle already in an ongoing dispatch", 403);
            }
            if (status == DispatchEnums.DispatchStatus.IN_PROGRESS) {
                throw new InvalidRequestException("Vehicle staged for dispatch and cannot be booked", 403);
            }
        }

        // 2) Verify user's score can cover the dispatch price
        Map<String, Object> scoreCheck = scoreIsEnough(requestBody);
        boolean canDispatch = (boolean) scoreCheck.getOrDefault("isEnough", false);
        if (!canDispatch) {
            throw new InvalidRequestException("User score too low for dispatch", 403);
        }

        // 3) Prepare request DTO for external service and send initial ‘requested’ event
        UtilRecords.dispatchRequestBodyDTO requestBodyDTO = new UtilRecords.dispatchRequestBodyDTO(
                requestBody.vehicleName(),
                requestBody.vehicleIdentificationNumber(),
                requestBody.vehicleStatus(),
                requestBody.dispatchReason(),
                userName,
                requestBody.dispatchEndTime(),
                null
        );

        Map<String, Object> dispatchResult = messagingService.sendDispatchRequestedEvent(requestBodyDTO);

        // 4) If external service returned a canDispatch flag override, apply it
        if (dispatchResult != null && dispatchResult.containsKey("canDispatch")) {
            canDispatch = (Boolean) dispatchResult.get("canDispatch");
            if (!canDispatch) {
                throw new InvalidRequestException("External service denied dispatch", 403);
            }
        }

        // 5) Map external response to our response DTO
        UtilRecords.DispatchResponseDTO finalResponse = dispatchResponseMapper.dispatchResponseMapper(dispatchResult);

        // 6) Build and persist DispatchModel entity
        DispatchModel finalDispatchModel = getDispatchModel(finalResponse, userName, userRole, userImage, requestBody, (Double) scoreCheck.get("price"));
        DispatchModel savedModel = dispatchRepository.save(finalDispatchModel);

        // 7) Deduct user score (negated)
        double finalScore = ((Number) scoreCheck.getOrDefault("finalUserScore", 0.0)).doubleValue();
        UtilRecords.DispatchScoreUpdateDto userScoreUpdate = new UtilRecords.DispatchScoreUpdateDto(
                requestBody.dispatchRequester(),
                savedModel.getDispatchId(),
                -finalScore
        );
        messagingService.updateUserScore(userScoreUpdate);

        // 8) Fire-and-forget event to signal created dispatch to other services
        UtilRecords.dispatchRequestBodyDTO finalDispatchDto = new UtilRecords.dispatchRequestBodyDTO(
                savedModel.getVehicleName(),
                savedModel.getDispatchVehicleId(),
                savedModel.getVehicleClass(),
                savedModel.getDispatchReason(),
                userName,
                requestBody.dispatchEndTime(),
                savedModel.getDispatchId()
        );
        messagingService.sendDispatchCreatedEventNoResponse(finalDispatchDto);

        logger.info("[DispatchRequest] Successfully completed requestVehicleDispatch for user: {}", userName);
        return savedModel;
    }

    /**
     * Cancels a dispatch requested by the user.
     * Allows cancellation for ONGOING (partial refund) and PENDING/IN_PROGRESS (full refund).
     */
    @Transactional
    public DispatchModel userCancelingDispatch(String userName, List<String> userRole, Long dispatchId) {

        logger.info("=== User Canceling Dispatch Request for user: {} ===", userName);

        if (userRole.isEmpty()) {
            throw new InvalidRequestException("No user role provided", 400);
        }

        DispatchModel dispatch = dispatchRepository.findByDispatchIdAndDispatchRequester(dispatchId, userName);
        if (dispatch == null) {
            throw new NotFoundException("No Dispatch Connected to that user is found");
        }

        if (!isStillValidDispatch(dispatch)) {
            logger.warn("Dispatch ID={} is no longer valid for cancellation.", dispatchId);
            return null;
        }

        if (!dispatch.getDispatchRequester().equals(userName)) {
            throw new InvalidRequestException("Cannot cancel another user's dispatch", 400);
        }

        switch (dispatch.getDispatchStatus()) {
            case ONGOING -> {
                // Partial refund based on unused time
                Double refund = calculateOngoingRefund(dispatch);
                UtilRecords.DispatchScoreUpdateDto userScoreUpdate = new UtilRecords.DispatchScoreUpdateDto(userName, dispatchId, refund);
                messagingService.updateUserScore(userScoreUpdate);

                dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.CANCELLED);

                UtilRecords.DispatchEndedDTO dispatchEnded = new UtilRecords.DispatchEndedDTO(
                        true, LocalDateTime.now(),
                        dispatch.getDispatchVehicleId(),
                        userName,
                        dispatch.getVehicleName(),
                        dispatchId);
                messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);

                return dispatchRepository.save(dispatch);
            }
            case PENDING, IN_PROGRESS -> {
                // Full refund
                Double fullRefund = dispatch.getDispatchCost();
                UtilRecords.DispatchScoreUpdateDto userScoreUpdate = new UtilRecords.DispatchScoreUpdateDto(userName, dispatchId, fullRefund);
                messagingService.updateUserScore(userScoreUpdate);

                dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.CANCELLED);

                UtilRecords.DispatchEndedDTO dispatchEnded = new UtilRecords.DispatchEndedDTO(
                        true, LocalDateTime.now(),
                        dispatch.getDispatchVehicleId(),
                        userName,
                        dispatch.getVehicleName(),
                        dispatchId);
                messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);

                return dispatchRepository.save(dispatch);
            }
            default -> throw new InvalidRequestException("Only ONGOING, PENDING or IN_PROGRESS dispatches can be cancelled by the user", 400);
        }
    }

    /* ======================
       Revalidation / query flows
       ====================== */

    /**
     * Revalidates and updates all dispatches for a user.
     * Expires dispatches that are past their end time, refunds scores if needed,
     * sends dispatch completion events and returns the updated list.
     */
    @Transactional
    public List<DispatchModel> revalidateMyDispatches(String user) {
        List<DispatchModel> userDispatches = dispatchRepository.findAllByDispatchRequester(user);
        List<DispatchModel> updatedDispatches = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (DispatchModel dispatch : userDispatches) {

            // Skip already finalized dispatches
            if (dispatch.getDispatchStatus() == COMPLETED ||
                    dispatch.getDispatchStatus() == CANCELLED ||
                    dispatch.getDispatchStatus() == EXPIRED) {
                continue;
            }

            LocalDateTime expiry = dispatch.getDispatchEndTime();
            if (expiry != null && expiry.isBefore(now)) {
                // Use centralized helper to process expiry / refunds / completion
                expireOrCompleteDispatch(dispatch, user, now);
                updatedDispatches.add(dispatch);
            }
        }
        // Persist only those that changed (expired/completed)
        return dispatchRepository.saveAll(updatedDispatches);
    }

    /**
     * Returns a list of all valid (non-expired, non-cancelled, non-completed) dispatches for a user.
     * Expired dispatches will be refunded and marked expired via the shared helper.
     */
    @Transactional
    public List<DispatchModel> revalidateMyActiveDispatches(String user) {
        List<DispatchModel> userDispatches = dispatchRepository.findAllByDispatchRequester(user);
        List<DispatchModel> validDispatches = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (DispatchModel dispatch : userDispatches) {
            LocalDateTime expiry = dispatch.getDispatchEndTime();

            // If already expired by time -> process
            if (expiry != null && expiry.isBefore(now)) {
                expireOrCompleteDispatch(dispatch, user, now);
                continue; // skip adding expired/completed ones to the "active" list
            }

            // Skip user-cancelled or already completed dispatches
            if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED ||
                    dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED) {
                continue;
            }

            validDispatches.add(dispatch);
        }

        // Save any status changes performed above (expired/completed)
        dispatchRepository.saveAll(userDispatches);
        return validDispatches;
    }

    /**
     * Revalidates a specific dispatch by user, dispatch ID, and vehicle ID.
     * Expires the dispatch if the end time has passed and sends refund/fanout if needed.
     */
    @Transactional
    public DispatchModel revalidateDispatchByIdUserAndVehicleId(String user, Long dispatchId, String vehicleId) {
        DispatchModel dispatch = dispatchRepository.findByDispatchRequesterAndDispatchIdAndDispatchVehicleId(user, dispatchId, vehicleId);
        LocalDateTime now = LocalDateTime.now();

        if (dispatch == null) {
            logger.warn("No dispatch found for user={} with dispatchId={} and vehicleId={}", user, dispatchId, vehicleId);
            return null;
        }

        LocalDateTime expiry = dispatch.getDispatchEndTime();
        if (expiry != null && expiry.isBefore(now)) {
            expireOrCompleteDispatch(dispatch, user, now);
            return dispatchRepository.save(dispatch);
        } else {
            return dispatch;
        }
    }

    /* ======================
       Completion / tracking / rating
       ====================== */

    /**
     * Completes a dispatch by marking status and end time.
     * Called when a dispatch-end event arrives from other systems.
     */
    @Transactional
    public void completeDispatch(UtilRecords.DispatchEndedDTO dispatchEnded) {
        DispatchModel dispatch = dispatchRepository.findByDispatchIdAndDispatchRequester(dispatchEnded.dispatchId(), dispatchEnded.receiver());

        if (dispatch == null) {
            logger.error("No dispatch found for completion with id={} and user={}", dispatchEnded.dispatchId(), dispatchEnded.receiver());
            throw new NotFoundException("Dispatch not found for completion");
        }

        if (!isStillValidDispatch(dispatch)) {
            logger.error("Dispatch is not valid before completion for id={}", dispatch.getDispatchId());
            throw new InvalidRequestException("Dispatch not valid for completion", 400);
        }

        if (!dispatch.getDispatchRequester().equals(dispatchEnded.receiver())) {
            throw new InvalidRequestException("Invalid user for dispatch completion", 400);
        }

        dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.COMPLETED);
        dispatch.setDispatchEndTime(dispatchEnded.timeStamp());

        dispatchRepository.save(dispatch);
        logger.info("Dispatch marked as COMPLETED for id={}", dispatch.getDispatchId());
    }

    /**
     * Handles tracking initialization event for a dispatch.
     * Sets status to ONGOING, sets start time, recalculates price and updates user score
     * with the difference (old - new) when appropriate.
     */
    @Transactional
    public void handleDispatchTracking(UtilRecords.StartTrackingDTO trackingEvent) {
        DispatchModel dispatch = dispatchRepository.findByDispatchId(trackingEvent.dispatchId());

        if (dispatch == null) {
            throw new NotFoundException("Dispatch not found");
        }

        if (!dispatch.getDispatchRequester().equals(trackingEvent.dispatchRequester())) {
            throw new ConflictException("User not valid for tracking external dispatch");
        }

        if (!isStillValidDispatch(dispatch)) {
            throw new ConflictException("Dispatch not valid for tracking");
        }

        dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.ONGOING);
        dispatch.setDispatchStartTime(LocalDateTime.now());

        // Build a lightweight request to recalculate price from the pricing engine
        UtilRecords.dispatchRequestBody dispatchRequest = new UtilRecords.dispatchRequestBody(
                dispatch.getVehicleName(),
                dispatch.getDispatchVehicleId(),
                dispatch.getVehicleClass(),
                dispatch.getDispatchReason(),
                dispatch.getDispatchRequester(),
                0.0,
                dispatch.getDispatchEndTime(),
                LocalDateTime.now()
        );

        // Recalculate price and compute the difference -> reward or charge adjustment
        Double newPrice = calculateDispatchPrice(dispatchRequest);
        Double oldPrice = dispatch.getDispatchCost();
        Double discountDifference = oldPrice - newPrice;
        dispatch.setDispatchCost(newPrice);

        UtilRecords.DispatchScoreUpdateDto scoreUpdate = new UtilRecords.DispatchScoreUpdateDto(dispatch.getDispatchRequester(), dispatch.getDispatchId(), discountDifference);
        messagingService.updateUserScore(scoreUpdate);

        dispatchRepository.save(dispatch);
    }

    /**
     * Sets a rating/review score for a completed dispatch.
     */
    @Transactional
    public DispatchModel setDispatchRating(Double rating, Long dispatchId, String username) {
        DispatchModel dispatch = dispatchRepository.findByDispatchIdAndDispatchRequester(dispatchId, username);
        if (!dispatch.getDispatchRequester().equals(username)) {
            throw new InvalidRequestException("Cannot rate another user's dispatch", 400);
        }
        dispatch.setDispatchReviewScore(rating);
        return dispatchRepository.save(dispatch);
    }

    /* ======================
       Utilities: model mapping, pricing, refunds
       ====================== */

    /**
     * Build a DispatchModel entity from external response + request + meta.
     * Kept inline for clarity like your original code.
     */
    private static DispatchModel getDispatchModel(
            UtilRecords.DispatchResponseDTO requestBody,
            String userName, List<String> roles, String userImage,
            UtilRecords.dispatchRequestBody dispatchRequestBody, double dispatchCost) {

        DispatchModel finalDispatchBody = new DispatchModel();

        // Identification and user info
        finalDispatchBody.setDispatchVehicleId(dispatchRequestBody.vehicleIdentificationNumber());
        finalDispatchBody.setDispatchRequesterRole(roles);
        finalDispatchBody.setUserImage(userImage);
        finalDispatchBody.setVehicleImage(requestBody.vehicleImage().getFirst());
        finalDispatchBody.setDispatchRequester(userName);

        // Dispatch attributes
        finalDispatchBody.setDispatchReason(dispatchRequestBody.dispatchReason());
        finalDispatchBody.setDispatchStatus(PENDING);
        finalDispatchBody.setDispatchRequestTime(dispatchRequestBody.dispatchRequestTime());
        finalDispatchBody.setVehicleClass(dispatchRequestBody.vehicleStatus());
        finalDispatchBody.setDispatchEndTime(dispatchRequestBody.dispatchEndTime());
        finalDispatchBody.setVehicleName(dispatchRequestBody.vehicleName());

        // External metadata
        finalDispatchBody.setCanDispatch(requestBody.canDispatch());
        finalDispatchBody.setHealthAttributes(requestBody.healthAttributes());
        finalDispatchBody.setWildCards(requestBody.wildCards());
        finalDispatchBody.setSafetyScore(requestBody.safetyScore());

        // Price/score
        finalDispatchBody.setDispatchCost(dispatchCost);

        return finalDispatchBody;
    }

    /**
     * Calculates the price for a dispatch based on vehicle class, dispatch reason, and dispatch duration.
     * Uses the shared costPerDay from AdminDispatchService for consistency.
     */
    public static Double calculateDispatchPrice(UtilRecords.dispatchRequestBody dispatchRequestBody) {

        double vehicleClassScore = 0;
        double dispatchReasonScore = 0;

        // Total hours between request and end time
        long totalHours = Duration.between(dispatchRequestBody.dispatchRequestTime(), dispatchRequestBody.dispatchEndTime()).toHours();

        // Convert hours into half-day blocks then to 'days' for pricing
        double halfDayBlocks = Math.ceil(totalHours / 12.0);
        double totalDays = halfDayBlocks * 0.5;

        // Time-based cost uses the shared costPerDay
        double totalScoreForDays = totalDays * costPerDay;

        // Vehicle class fee
        if (dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.CLASSIFIED) {
            vehicleClassScore = 1000;
        } else if (dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.CARGO) {
            vehicleClassScore = 300;
        } else if (dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.REGULAR) {
            vehicleClassScore = 200;
        } else if (dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.TRANSPORT) {
            vehicleClassScore = 400;
        }

        // Dispatch reason fee
        if (dispatchRequestBody.dispatchReason() == DispatchEnums.DispatchReason.CLASSIFIED) {
            dispatchReasonScore = 1000;
        } else if (dispatchRequestBody.dispatchReason() == DispatchEnums.DispatchReason.DELIVERY) {
            dispatchReasonScore = 200;
        } else if (dispatchRequestBody.dispatchReason() == DispatchEnums.DispatchReason.TRANSPORT) {
            dispatchReasonScore = 150;
        }

        return dispatchReasonScore + vehicleClassScore + totalScoreForDays;
    }

    /**
     * Checks if the user has enough score to pay for the dispatch.
     * Returns a map with keys: isEnough, finalUserScore, price
     */
    private static Map<String, Object> scoreIsEnough(UtilRecords.dispatchRequestBody requestBody) {
        Double dispatchPrice = calculateDispatchPrice(requestBody);
        double costAfterPay = requestBody.userDispatchScore() - dispatchPrice;

        Map<String, Object> response = new HashMap<>();
        response.put("isEnough", costAfterPay > 0);
        response.put("finalUserScore", costAfterPay);
        response.put("price", dispatchPrice);

        return response;
    }

    /**
     * Calculates refund amount for a canceling dispatch that is ongoing.
     * Refund is proportional to unused time plus 10% of flat fees.
     */
    public Double calculateOngoingRefund(DispatchModel dispatch) {

        LocalDateTime startTime  = dispatch.getDispatchStartTime();
        LocalDateTime cancelTime = LocalDateTime.now();
        LocalDateTime endTime    = dispatch.getDispatchEndTime();

        if (startTime == null || endTime == null) return 0.0;
        if (cancelTime.isAfter(endTime)) return 0.0;
        if (cancelTime.isBefore(startTime)) return 0.0;

        long totalDurationMinutes = Duration.between(startTime, endTime).toMinutes();
        long remainingMinutes     = Duration.between(cancelTime, endTime).toMinutes();

        if (totalDurationMinutes <= 0 || remainingMinutes <= 0) return 0.0;

        double unusedRatio = (double) remainingMinutes / totalDurationMinutes;
        long totalHours = Duration.between(startTime, endTime).toHours();

        return getRefundable(dispatch, totalHours, unusedRatio);
    }

    /**
     * Helper to compute refundable amount (prorated time + 10% flat fees).
     */
    private static double getRefundable(DispatchModel dispatch, long totalHours, double unusedRatio) {
        double halfDayBlocks = Math.ceil(totalHours / 12.0);
        double totalDays = halfDayBlocks * 0.5;
        double timeBasedCost = totalDays * costPerDay;

        double vehicleClassScore = switch (dispatch.getVehicleClass()) {
            case CLASSIFIED -> 1000;
            case CARGO      -> 300;
            case REGULAR    -> 200;
            case TRANSPORT  -> 400;
        };

        double dispatchReasonScore = switch (dispatch.getDispatchReason()) {
            case CLASSIFIED -> 1000;
            case DELIVERY   -> 200;
            case TRANSPORT  -> 150;
        };

        double flatFees = vehicleClassScore + dispatchReasonScore;
        double refundableFlat = flatFees * 0.1;

        return (timeBasedCost * unusedRatio) + refundableFlat;
    }

    /**
     * Validates that a dispatch is still actionable (not expired/cancelled/completed).
     * Throws ConflictException on invalid states.
     */
    private static Boolean isStillValidDispatch(DispatchModel dispatch) {
        if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED) {
            throw new ConflictException("Dispatch not found in staging: it must be expired");
        }

        if (dispatch.getDispatchStatus() == COMPLETED) {
            throw new ConflictException("Dispatch not found in staging : The dispatch must be completed");
        }

        LocalDateTime endTime = dispatch.getDispatchEndTime();
        LocalDateTime now = LocalDateTime.now();

        if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED) {
            throw new ConflictException("Dispatch not found in staging: dispatch is cancelled");
        }

        if (endTime != null && endTime.isBefore(now)) {
            throw new ConflictException("Dispatch has already ended.");
        }

        return true;
    }
}
