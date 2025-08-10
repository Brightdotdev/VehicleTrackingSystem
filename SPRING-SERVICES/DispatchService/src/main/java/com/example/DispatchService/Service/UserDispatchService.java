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


@Service
public class UserDispatchService {

    private final DispatchRepository dispatchRepository;
    private final Logger logger = LoggerFactory.getLogger(UserDispatchService.class);

    private final ResponseMapperService dispatchResponseMapper;
    private final MessagingService messagingService;

    // Constant cost per day for dispatch (consider externalizing to config)
    private static final double COST_PER_DAY = 500;

    /**
     * Constructor for dependency injection.
     */
    public UserDispatchService(DispatchRepository dispatchRepository, ResponseMapperService dispatchResponseMapper, MessagingService messagingService) {
        this.dispatchRepository = dispatchRepository;
        this.dispatchResponseMapper = dispatchResponseMapper;
        this.messagingService = messagingService;
    }

    /**
     * Handles a new vehicle dispatch request.
     * Validates vehicle availability, user score, and sends dispatch events.
     *
     * @param requestBody The dispatch request details.
     * @param userName    The username requesting the dispatch.
     * @param userImage   User's profile image or identifier.
     * @param userRole    List of roles assigned to the user.
     * @return Saved DispatchModel with updated information.
     * @throws InvalidRequestException if dispatch conflicts or validation fails.
     */
    @Transactional
    public DispatchModel requestVehicleDispatch(
            UtilRecords.dispatchRequestBody requestBody,
            String userName,
            String userImage,
            List<String> userRole) {

        logger.info("[DispatchRequest] Starting requestVehicleDispatch for user: {}", userName);

        // Check for vehicle conflicts in existing dispatches
        List<DispatchModel> existingDispatches = dispatchRepository.findByDispatchVehicleId(requestBody.vehicleIdentificationNumber());
        for (DispatchModel dispatchModel : existingDispatches) {
            DispatchEnums.DispatchStatus status = dispatchModel.getDispatchStatus();

            if (status == DispatchEnums.DispatchStatus.COMPLETED ||
                    status == DispatchEnums.DispatchStatus.CANCELLED ||
                    status == DispatchEnums.DispatchStatus.EXPIRED) {
                continue; // No conflict, ignore
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

        // Check user score eligibility for dispatch
        Map<String, Object> scoreCheck = scoreIsEnough(requestBody);
        boolean canDispatch = (boolean) scoreCheck.getOrDefault("isEnough", false);
        if (!canDispatch) {
            throw new InvalidRequestException("User score too low for dispatch", 403);
        }

        // Prepare dispatch request DTO to send via messaging
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

        // Extract 'canDispatch' flag from response if present
        if (dispatchResult.containsKey("canDispatch")) {
            canDispatch = (Boolean) dispatchResult.get("canDispatch");
        }

        // Map response to DispatchResponseDTO
        UtilRecords.DispatchResponseDTO finalResponse = dispatchResponseMapper.dispatchResponseMapper(dispatchResult);

        // Create DispatchModel entity from response and request details
        DispatchModel finalDispatchModel = getDispatchModel(finalResponse, userName, userRole, userImage, requestBody, (Double) scoreCheck.get("price"));
        DispatchModel savedModel = dispatchRepository.save(finalDispatchModel);

        // Update user score based on dispatch cost (negated)
        double finalScore = ((Number) scoreCheck.getOrDefault("finalUserScore", 0.0)).doubleValue();
        UtilRecords.DispatchScoreUpdateDto userScoreUpdate = new UtilRecords.DispatchScoreUpdateDto(
                requestBody.dispatchRequester(),
                savedModel.getDispatchId(),
                -finalScore
        );
        messagingService.updateUserScore(userScoreUpdate);

        // Send dispatch created event (async, no wait for response)
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
     * Handles refunds and sends dispatch completion fanout events.
     *
     * @param userName  Username requesting cancellation.
     * @param userRole  List of roles for authorization checks.
     * @param dispatchId Dispatch ID to cancel.
     * @return Updated DispatchModel after cancellation.
     * @throws InvalidRequestException if cancellation conditions are not met.
     * @throws NotFoundException       if dispatch not found.
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
            default -> throw new InvalidRequestException("Only ONGOING or PENDING dispatches can be cancelled by the user", 400);
        }
    }

    /**
     * Revalidates and updates all dispatches for a user.
     * Expires dispatches that are past their end time, refunds scores if needed,
     * and sends dispatch completion events.
     *
     * @param user Username to revalidate dispatches for.
     * @return List of updated DispatchModel entities.
     */
    @Transactional
    public List<DispatchModel> revalidateMyDispatches(String user) {
        List<DispatchModel> userDispatches = dispatchRepository.findAllByDispatchRequester(user);
        List<DispatchModel> updatedDispatches = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (DispatchModel dispatch : userDispatches) {
            LocalDateTime expiry = dispatch.getDispatchEndTime();

            if (expiry.isBefore(now)) {
                if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.IN_PROGRESS || dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.PENDING) {
                    UtilRecords.DispatchScoreUpdateDto refundDto = new UtilRecords.DispatchScoreUpdateDto(
                            dispatch.getDispatchRequester(),
                            dispatch.getDispatchId(),
                            dispatch.getDispatchCost()
                    );
                    messagingService.updateUserScore(refundDto);
                }
                dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
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
                updatedDispatches.add(dispatch);
            }
        }
        return dispatchRepository.saveAll(updatedDispatches);
    }

    /**
     * Returns a list of all valid (non-expired, non-cancelled, non-completed) dispatches for a user.
     * Expired dispatches will be refunded and marked expired.
     *
     * @param user Username for which to get active dispatches.
     * @return List of active DispatchModel entities.
     */
    @Transactional
    public List<DispatchModel> revalidateMyActiveDispatches(String user) {
        List<DispatchModel> userDispatches = dispatchRepository.findAllByDispatchRequester(user);
        List<DispatchModel> validDispatches = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (DispatchModel dispatch : userDispatches) {
            LocalDateTime expiry = dispatch.getDispatchEndTime();

            if (expiry.isBefore(now)) {
                if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.IN_PROGRESS || dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.PENDING) {
                    UtilRecords.DispatchScoreUpdateDto refundDto = new UtilRecords.DispatchScoreUpdateDto(
                            dispatch.getDispatchRequester(),
                            dispatch.getDispatchId(),
                            dispatch.getDispatchCost()
                    );
                    messagingService.updateUserScore(refundDto);
                }
                dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
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
                continue;
            }

            if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED || dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED) {
                continue; // Skip invalid dispatches
            }

            validDispatches.add(dispatch);
        }

        dispatchRepository.saveAll(userDispatches); // Save any changes to dispatch statuses
        return validDispatches;
    }

    /**
     * Revalidates a specific dispatch by user, dispatch ID, and vehicle ID.
     * Expires the dispatch if the end time has passed and sends refund and fanout if needed.
     *
     * @param user      Username owning the dispatch.
     * @param dispatchId Dispatch ID.
     * @param vehicleId Vehicle identification number.
     * @return Updated DispatchModel.
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
        if (expiry.isBefore(now)) {
            if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.IN_PROGRESS || dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.PENDING) {
                UtilRecords.DispatchScoreUpdateDto refundDto = new UtilRecords.DispatchScoreUpdateDto(
                        dispatch.getDispatchRequester(),
                        dispatch.getDispatchId(),
                        dispatch.getDispatchCost()
                );
                messagingService.updateUserScore(refundDto);
            }
            dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
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
            return dispatchRepository.save(dispatch);
        } else {
            return dispatch;
        }
    }

    /**
     * Completes a dispatch by marking status and end time.
     * Internal method called by messaging listeners.
     *
     * @param dispatchEnded Dispatch completion event DTO.
     * @throws InvalidRequestException if validation fails.
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
     * Updates status and recalculates user score based on new dispatch price.
     *
     * @param trackingEvent StartTrackingDTO event containing dispatch info.
     * @throws NotFoundException   if dispatch not found.
     * @throws ConflictException   if user validation or dispatch status invalid.
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

        // Prepare dispatch request for price recalculation
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

        // Calculate new dispatch price and update cost
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
     *
     * @param rating   Rating score (e.g., 1-5 stars).
     * @param dispatchId Dispatch ID to rate.
     * @param username Username of the requester (must match dispatch owner).
     * @return Updated DispatchModel with rating saved.
     * @throws InvalidRequestException if user does not own dispatch.
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
    /**
     * Utility static methods related to dispatch calculations and validations.
     * Kept minimal here, so no separate utility class/file.
     */

    private static DispatchModel getDispatchModel(
            UtilRecords.DispatchResponseDTO requestBody,
            String userName, List<String> roles, String userImage,
            UtilRecords.dispatchRequestBody dispatchRequestBody, double dispatchCost) {

        // Create new DispatchModel entity and populate fields based on request and response DTOs
        DispatchModel finalDispatchBody = new DispatchModel();

        // Set basic vehicle and user info
        finalDispatchBody.setDispatchVehicleId(dispatchRequestBody.vehicleIdentificationNumber());
        finalDispatchBody.setDispatchRequesterRole(roles);
        finalDispatchBody.setUserImage(userImage);

        // Vehicle image - take first from response DTO list
        finalDispatchBody.setVehicleImage(requestBody.vehicleImage().getFirst());

        // Requester username
        finalDispatchBody.setDispatchRequester(userName);

        // Dispatch specifics
        finalDispatchBody.setDispatchReason(dispatchRequestBody.dispatchReason());
        finalDispatchBody.setDispatchStatus(PENDING);  // Default status on creation
        finalDispatchBody.setDispatchRequestTime(dispatchRequestBody.dispatchRequestTime());
        finalDispatchBody.setVehicleClass(dispatchRequestBody.vehicleStatus());
        finalDispatchBody.setDispatchEndTime(dispatchRequestBody.dispatchEndTime());
        finalDispatchBody.setVehicleName(dispatchRequestBody.vehicleName());

        // Additional metadata from response DTO
        finalDispatchBody.setCanDispatch(requestBody.canDispatch());
        finalDispatchBody.setHealthAttributes(requestBody.healthAttributes());
        finalDispatchBody.setWildCards(requestBody.wildCards());
        finalDispatchBody.setSafetyScore(requestBody.safetyScore());

        // Set the cost calculated for the dispatch
        finalDispatchBody.setDispatchCost(dispatchCost);

        return finalDispatchBody;
    }

    /**
     * Calculates the price for a dispatch based on vehicle class, dispatch reason, and dispatch duration.
     *
     * @param dispatchRequestBody DTO containing vehicle info and dispatch times
     * @return Total price (score) for the dispatch
     */
    public static Double calculateDispatchPrice(UtilRecords.dispatchRequestBody dispatchRequestBody) {

        double vehicleClassScore = 0;
        double dispatchReasonScore = 0;

        // Calculate total duration in hours between request and end time
        long totalHours = Duration.between(dispatchRequestBody.dispatchRequestTime(), dispatchRequestBody.dispatchEndTime()).toHours();

        // Calculate half-day blocks, rounding up, then convert to total days (0.5 days per half-day)
        double halfDayBlocks = Math.ceil(totalHours / 12.0);
        double totalDays = halfDayBlocks * 0.5;

        // Calculate time-based cost: cost per day * total days
        double totalScoreForDays = totalDays * costPerDay;

        // Vehicle class fee based on vehicle status
        if (dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.CLASSIFIED) {
            vehicleClassScore = 1000;
        } else if (dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.CARGO) {
            vehicleClassScore = 300;
        } else if (dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.REGULAR) {
            vehicleClassScore = 200;
        } else if (dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.TRANSPORT) {
            vehicleClassScore = 400;
        }

        // Dispatch reason fee based on reason
        if (dispatchRequestBody.dispatchReason() == DispatchEnums.DispatchReason.CLASSIFIED) {
            dispatchReasonScore = 1000;
        } else if (dispatchRequestBody.dispatchReason() == DispatchEnums.DispatchReason.DELIVERY) {
            dispatchReasonScore = 200;
        } else if (dispatchRequestBody.dispatchReason() == DispatchEnums.DispatchReason.TRANSPORT) {
            dispatchReasonScore = 150;
        }

        // Total dispatch cost = sum of reason score + vehicle class score + time-based cost
        return dispatchReasonScore + vehicleClassScore + totalScoreForDays;
    }

    /**
     * Checks if the user has enough score to pay for the dispatch.
     * Returns a map with keys: isEnough (boolean), finalUserScore (score after payment), and price (dispatch cost).
     *
     * @param requestBody Dispatch request details including user's current score
     * @return Map with eligibility and pricing info
     */
    private static Map<String, Object> scoreIsEnough(UtilRecords.dispatchRequestBody requestBody) {

        // Calculate price for the dispatch
        Double dispatchPrice = calculateDispatchPrice(requestBody);

        // Calculate remaining user score after paying dispatch price
        double costAfterPay = requestBody.userDispatchScore() - dispatchPrice;

        Map<String, Object> response = new HashMap<>();

        // If remaining score > 0, user can dispatch
        response.put("isEnough", costAfterPay > 0);
        response.put("finalUserScore", costAfterPay);
        response.put("price", dispatchPrice);

        return response;
    }

    /**
     * Calculates refund amount for a canceling dispatch that is ongoing.
     * Refund is proportional to unused time plus 10% of flat fees.
     *
     * @param dispatch DispatchModel representing the ongoing dispatch
     * @return Refund amount (double)
     */
    public Double calculateOngoingRefund(DispatchModel dispatch) {

        LocalDateTime startTime  = dispatch.getDispatchStartTime(); // Dispatch start time
        LocalDateTime cancelTime = LocalDateTime.now();             // Cancellation time (now)
        LocalDateTime endTime    = dispatch.getDispatchEndTime();   // Scheduled dispatch end time

        // Validation checks: if times missing or cancel after end or before start, no refund
        if (startTime == null || endTime == null) return 0.0;
        if (cancelTime.isAfter(endTime)) return 0.0;
        if (cancelTime.isBefore(startTime)) return 0.0;

        // Calculate total duration and remaining time in minutes
        long totalDurationMinutes = Duration.between(startTime, endTime).toMinutes();
        long remainingMinutes     = Duration.between(cancelTime, endTime).toMinutes();

        if (totalDurationMinutes <= 0 || remainingMinutes <= 0) return 0.0;

        // Ratio of unused time to total duration
        double unusedRatio = (double) remainingMinutes / totalDurationMinutes;

        // Recalculate refundable amount based on unused ratio
        long totalHours = Duration.between(startTime, endTime).toHours();

        return getRefundable(dispatch, totalHours, unusedRatio);
    }

    /**
     * Helper to calculate refundable amount based on dispatch duration and unused ratio.
     * Includes flat fees (vehicle class + dispatch reason) and prorated time cost.
     *
     * @param dispatch DispatchModel to calculate refund for
     * @param totalHours Total hours originally booked
     * @param unusedRatio Ratio of unused time (0.0-1.0)
     * @return Refund amount (double)
     */
    private static double getRefundable(DispatchModel dispatch, long totalHours, double unusedRatio) {
        // Calculate time-based cost for booked dispatch
        double halfDayBlocks = Math.ceil(totalHours / 12.0);
        double totalDays = halfDayBlocks * 0.5;
        double timeBasedCost = totalDays * costPerDay;

        // Flat fees based on vehicle class
        double vehicleClassScore = switch (dispatch.getVehicleClass()) {
            case CLASSIFIED -> 1000;
            case CARGO      -> 300;
            case REGULAR    -> 200;
            case TRANSPORT  -> 400;
        };

        // Flat fees based on dispatch reason
        double dispatchReasonScore = switch (dispatch.getDispatchReason()) {
            case CLASSIFIED -> 1000;
            case DELIVERY   -> 200;
            case TRANSPORT  -> 150;
        };

        double flatFees = vehicleClassScore + dispatchReasonScore;

        // Refundable flat fee is 10% of flat fees
        double refundableFlat = flatFees * 0.1;

        // Total refundable = prorated time cost + refundable flat fees
        return (timeBasedCost * unusedRatio) + refundableFlat;
    }

    /**
     * Validates if a dispatch is still valid for operations (e.g., cancelling, completing).
     * Throws ConflictException if dispatch is expired, cancelled, or ended.
     *
     * @param dispatch DispatchModel to validate
     * @return true if dispatch is valid, otherwise exception thrown
     * @throws ConflictException if dispatch is expired, cancelled, or ended
     */
    private static Boolean isStillValidDispatch(DispatchModel dispatch) {
        if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED) {
            throw new ConflictException("Dispatch not found in staging: must be expired");
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
