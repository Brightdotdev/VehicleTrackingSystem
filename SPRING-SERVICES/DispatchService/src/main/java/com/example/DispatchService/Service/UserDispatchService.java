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

import static com.example.DispatchService.Utils.DispatchEnums.DispatchStatus.*;


@Service
public class UserDispatchService {
    // Dependencies
    private final DispatchRepository dispatchRepository;
    private final Logger logger = LoggerFactory.getLogger(UserDispatchService.class);
    private final ResponseMapperService dispatchResponseMapper;
    private final MessagingService messagingService;

    static double costPerDay = 500;  // Cost rate for dispatch calculations

    // Constructor to inject dependencies
    public UserDispatchService(DispatchRepository dispatchRepository, ResponseMapperService dispatchResponseMapper, MessagingService messagingService) {
        this.dispatchRepository = dispatchRepository;
        this.dispatchResponseMapper = dispatchResponseMapper;
        this.messagingService = messagingService;
    }

    /**
     * User requests a vehicle dispatch.
     */
    @Transactional
    public DispatchModel requestVehicleDispatch(
            UtilRecords.dispatchRequestBody requestBody,
            String userName,
            String userImage,
            List<String> userRole) {

        // Log entry and inputs for tracing/debugging
        logger.info("[DispatchRequest] Starting requestVehicleDispatch");
        logger.debug("[DispatchRequest] Request body: {}", requestBody);
        logger.debug("[DispatchRequest] User: {}, Roles: {}, Image: {}", userName, userRole, userImage);

        // Retrieve existing dispatches for the vehicle to check conflicts
        List<DispatchModel> foundVehicleDispatches =
                dispatchRepository.findByDispatchVehicleId(requestBody.vehicleIdentificationNumber());
        logger.debug("[DispatchRequest] Found {} existing dispatch records for vehicle VIN: {}",
                foundVehicleDispatches.size(), requestBody.vehicleIdentificationNumber());

        // Check for conflicting dispatch statuses that prevent new requests
        for (DispatchModel dispatchModel : foundVehicleDispatches) {
            logger.trace("[DispatchRequest] Checking dispatch record ID={} with status={}",
                    dispatchModel.getDispatchId(), dispatchModel.getDispatchStatus());

            // Ignore completed, cancelled, or expired dispatches
            if (dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED ||
                    dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED ||
                    dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED) {
                continue;
            }

            // If vehicle is already requested or in progress, reject with error
            if (dispatchModel.getDispatchStatus().equals(PENDING)) {
                logger.warn("[DispatchRequest] Conflict: Vehicle already requested by another user");
                throw new InvalidRequestException("Vehicle already requested by another user", 403);
            }
            if (dispatchModel.getDispatchStatus().equals(ONGOING)) {
                logger.warn("[DispatchRequest] Conflict: Vehicle already in ongoing dispatch");
                throw new InvalidRequestException("The current vehicle is already in an ongoing dispatch", 403);
            }
            if (dispatchModel.getDispatchStatus().equals(DispatchEnums.DispatchStatus.IN_PROGRESS)) {
                logger.warn("[DispatchRequest] Conflict: Vehicle staged for dispatch");
                throw new InvalidRequestException("The current vehicle is already staged for dispatch and cannot be booked", 403);
            }
        }

        // Check if user has enough score to request dispatch
        Map<String, Object> scoreCheck = scoreIsEnough(requestBody);
        logger.debug("[DispatchRequest] Score check result: {}", scoreCheck);

        if (!(boolean) scoreCheck.get("isEnough")) {
            logger.warn("[DispatchRequest] User score too low for dispatch");
            throw new InvalidRequestException("Your Score is Too Low For Dispatch", 403);
        }

        // Create a DTO for dispatch request to send over messaging system
        UtilRecords.dispatchRequestBodyDTO requestBodyDTO =
                new UtilRecords.dispatchRequestBodyDTO(
                        requestBody.vehicleName(),
                        requestBody.vehicleIdentificationNumber(),
                        requestBody.vehicleStatus(),
                        requestBody.dispatchReason(),
                        userName,
                        requestBody.dispatchEndTime(),
                        null
                );
        logger.debug("[DispatchRequest] Created requestBodyDTO: {}", requestBodyDTO);

        // Send the dispatch request event and capture response
        Map<String, Object> dispatchResult = messagingService.sendDispatchRequestedEvent(requestBodyDTO);
        logger.debug("[DispatchRequest] Dispatch event response: {}", dispatchResult);

        boolean canDispatch = false;
        if (dispatchResult.containsKey("canDispatch")) {
            canDispatch = (Boolean) dispatchResult.get("canDispatch");
            logger.debug("[DispatchRequest] canDispatch flag: {}", canDispatch);
        }

        // Map the messaging response to internal DispatchResponseDTO
        UtilRecords.DispatchResponseDTO finalResponse =
                dispatchResponseMapper.dispatchResponseMapper(dispatchResult);
        logger.debug("[DispatchRequest] Mapped final response DTO: {}", finalResponse);

        // Build final DispatchModel to save into the database
        DispatchModel finalDispatchModel = getDispatchModel(finalResponse, userName, userRole, userImage, requestBody, (Double) scoreCheck.get("price"));
        DispatchModel savedModel = dispatchRepository.save(finalDispatchModel);
        logger.info("[DispatchRequest] DispatchModel saved with ID: {}", savedModel.getDispatchId());

        // Update user score negatively (deduct points for dispatch)
        Object rawScore = scoreCheck.get("finalUserScore");
        double finalScore = rawScore instanceof Number ? ((Number) rawScore).doubleValue() : 0.0;
        double negatedScore = -finalScore;
        logger.debug("[DispatchRequest] Final score: {}, negated: {}", finalScore, negatedScore);

        UtilRecords.DispatchScoreUpdateDto userScoreUpdate =
                new UtilRecords.DispatchScoreUpdateDto(requestBody.dispatchRequester(),
                        savedModel.getDispatchId(),
                        negatedScore);
        messagingService.updateUserScore(userScoreUpdate);
        logger.debug("[DispatchRequest] Sent user score update: {}", userScoreUpdate);

        // Send event for created dispatch without expecting a response
        UtilRecords.dispatchRequestBodyDTO finalDispatchDto =
                new UtilRecords.dispatchRequestBodyDTO(
                        savedModel.getVehicleName(),
                        savedModel.getDispatchVehicleId(),
                        savedModel.getVehicleClass(),
                        savedModel.getDispatchReason(),
                        userName,
                        requestBody.dispatchEndTime(),
                        savedModel.getDispatchId()
                );
        messagingService.sendDispatchCreatedEventNoResponse(finalDispatchDto);
        logger.info("[DispatchRequest] Dispatch created event sent for ID: {}", savedModel.getDispatchId());

        // Return the saved dispatch
        logger.info("[DispatchRequest] Completed requestVehicleDispatch successfully for user: {}", userName);
        return savedModel;
    }

    /**
     * User cancels their own dispatch.
     */
    @Transactional
    public DispatchModel userCancelingDispatch(String userName, List<String> userRole, Long dispatchId) {

        logger.info("=== User Canceling Dispatch Request ===");
        logger.debug("Request received with userName={}, userRole={}, dispatchId={}", userName, userRole, dispatchId);

        if (userRole.isEmpty()) {
            logger.warn("User '{}' has no roles assigned. Throwing InvalidRequestException.", userName);
            throw new InvalidRequestException("No user role provided", 400);
        }

        DispatchModel dispatch = dispatchRepository.findByDispatchIdAndDispatchRequester(dispatchId, userName);

        if (dispatch == null) {
            logger.error("No dispatch found for user '{}' with dispatchId={}", userName, dispatchId);
            throw new NotFoundException("No Dispatch Connected to that user is found");
        }
        logger.info("Dispatch found: status={}, cost={}, vehicleId={}",
                dispatch.getDispatchStatus(), dispatch.getDispatchCost(), dispatch.getDispatchVehicleId());

        // Validate if dispatch can be cancelled (e.g., not expired or completed)
        if (!isStillValidDispatch(dispatch)) {
            logger.warn("Dispatch ID={} for user '{}' is no longer valid for cancellation.", dispatchId, userName);
            return null;
        }

        // Ensure user owns the dispatch
        if (!dispatch.getDispatchRequester().equals(userName)) {
            logger.error("User '{}' attempted to cancel another user's dispatch (owner={})",
                    userName, dispatch.getDispatchRequester());
            throw new InvalidRequestException("An external user cannot cancel another user's dispatch", 400);
        }

        // Handle refund and status update based on dispatch status
        if (dispatch.getDispatchStatus() == ONGOING) {
            logger.info("Cancelling ONGOING dispatch ID={} for user '{}'", dispatchId, userName);

            Double userRefund = calculateOngoingRefund(dispatch);
            logger.debug("Calculated ongoing refund amount: {}", userRefund);

            UtilRecords.DispatchScoreUpdateDto userScoreUpdate =
                    new UtilRecords.DispatchScoreUpdateDto(userName, dispatchId, userRefund);
            messagingService.updateUserScore(userScoreUpdate);
            logger.info("User score updated with refund of {}", userRefund);

            dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.CANCELLED);
            logger.debug("Dispatch status set to CANCELLED");

            UtilRecords.DispatchEndedDTO dispatchEnded =
                    new UtilRecords.DispatchEndedDTO(true, LocalDateTime.now(),
                            dispatch.getDispatchVehicleId(), userName,
                            dispatch.getVehicleName(), dispatchId);
            messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);
            logger.info("Sent 'dispatch completed' fanout for cancelled ONGOING dispatch");

            return dispatchRepository.save(dispatch);
        }

        if (dispatch.getDispatchStatus() == PENDING || dispatch.getDispatchStatus() == IN_PROGRESS) {
            logger.info("Cancelling {} dispatch ID={} for user '{}'", dispatch.getDispatchStatus(), dispatchId, userName);

            Double fullRefund = dispatch.getDispatchCost();
            logger.debug("Full refund amount: {}", fullRefund);

            UtilRecords.DispatchScoreUpdateDto userScoreUpdate =
                    new UtilRecords.DispatchScoreUpdateDto(userName, dispatchId, fullRefund);
            messagingService.updateUserScore(userScoreUpdate);
            logger.info("User score updated with full refund of {}", fullRefund);

            dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.CANCELLED);
            logger.debug("Dispatch status set to CANCELLED");

            UtilRecords.DispatchEndedDTO dispatchEnded =
                    new UtilRecords.DispatchEndedDTO(true, LocalDateTime.now(),
                            dispatch.getDispatchVehicleId(), userName,
                            dispatch.getVehicleName(), dispatchId);
            messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);
            logger.info("Sent 'dispatch completed' fanout for cancelled {} dispatch", dispatch.getDispatchStatus());

            return dispatchRepository.save(dispatch);
        }

        logger.error("Attempt to cancel dispatch ID={} with invalid status={}",
                dispatchId, dispatch.getDispatchStatus());
        throw new InvalidRequestException("Only ONGOING or PENDING dispatches can be cancelled by the user", 400);
    }
    /**
     * Builds a DispatchModel object from various inputs, to be saved in DB.
     * @param requestBody the DTO with dispatch response data (including vehicle images, health, etc)
     * @param userName name of the user requesting the dispatch
     * @param roles user roles list
     * @param userImage user's profile image URL or identifier
     * @param dispatchRequestBody original dispatch request body with vehicle and dispatch info
     * @param dispatchCost calculated cost of the dispatch
     * @return populated DispatchModel object ready to save
     */
    private static DispatchModel getDispatchModel(
            UtilRecords.DispatchResponseDTO requestBody,
            String userName, List<String> roles, String userImage,
            UtilRecords.dispatchRequestBody dispatchRequestBody, double dispatchCost) {

        DispatchModel finalDispatchBody = new DispatchModel();

        // Set vehicle and requester info
        finalDispatchBody.setDispatchVehicleId(dispatchRequestBody.vehicleIdentificationNumber());
        finalDispatchBody.setDispatchRequesterRole(roles);
        finalDispatchBody.setUserImage(userImage);
        finalDispatchBody.setVehicleImage(requestBody.vehicleImage().getFirst());
        finalDispatchBody.setDispatchRequester(userName);
        finalDispatchBody.setDispatchReason(dispatchRequestBody.dispatchReason());

        // Set initial status and timestamps
        finalDispatchBody.setDispatchStatus(PENDING);
        finalDispatchBody.setDispatchRequestTime(dispatchRequestBody.dispatchRequestTime());
        finalDispatchBody.setDispatchEndTime(dispatchRequestBody.dispatchEndTime());

        // Vehicle details
        finalDispatchBody.setVehicleClass(dispatchRequestBody.vehicleStatus());
        finalDispatchBody.setVehicleName(dispatchRequestBody.vehicleName());

        // Set flags and attributes from response DTO
        finalDispatchBody.setCanDispatch(requestBody.canDispatch());
        finalDispatchBody.setHealthAttributes(requestBody.healthAttributes());
        finalDispatchBody.setWildCards(requestBody.wildCards());
        finalDispatchBody.setSafetyScore(requestBody.safetyScore());

        // Set the dispatch cost
        finalDispatchBody.setDispatchCost(dispatchCost);

        return finalDispatchBody;
    }

    /**
     * Calculates the dispatch price based on vehicle class, dispatch reason, and duration.
     * Uses fixed cost per half-day blocks and flat fees for vehicle type and reason.
     * @param dispatchRequestBody the dispatch request data containing times and vehicle info
     * @return the total calculated dispatch price
     */
    public static Double calculateDispatchPrice(UtilRecords.dispatchRequestBody dispatchRequestBody) {

        double vehicleClassScore = 0;
        double dispatchReasonScore = 0;

        // Calculate duration in hours between request start and end time
        long totalHours = Duration.between(dispatchRequestBody.dispatchRequestTime(), dispatchRequestBody.dispatchEndTime()).toHours();

        // Calculate half-day blocks (ceil to cover partial periods)
        double halfDayBlocks = Math.ceil(totalHours / 12.0);
        double totalDays = halfDayBlocks * 0.5;

        // Calculate time-based cost
        double totalScoreForDays = totalDays * costPerDay;

        // Assign flat vehicle class cost
        if(dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.CLASSIFIED){
            vehicleClassScore = 1000;
        } else if(dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.CARGO){
            vehicleClassScore = 300;
        } else if(dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.REGULAR){
            vehicleClassScore = 200;
        } else if(dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.TRANSPORT){
            vehicleClassScore = 400;
        }

        // Assign flat dispatch reason cost
        if(dispatchRequestBody.dispatchReason() == DispatchEnums.DispatchReason.CLASSIFIED){
            dispatchReasonScore = 1000;
        } else if(dispatchRequestBody.dispatchReason() == DispatchEnums.DispatchReason.DELIVERY){
            dispatchReasonScore = 200;
        } else if(dispatchRequestBody.dispatchReason() == DispatchEnums.DispatchReason.TRANSPORT){
            dispatchReasonScore = 150;
        }

        // Total price is sum of time-based cost + flat fees
        return dispatchReasonScore + vehicleClassScore + totalScoreForDays;
    }

    /**
     * Checks if the user has enough score to cover dispatch cost.
     * Returns a map with:
     *  - isEnough: boolean if user score covers dispatch price
     *  - finalUserScore: user's score after deducting dispatch price
     *  - price: calculated dispatch price
     * @param requestBody dispatch request data including user score
     * @return Map with isEnough, finalUserScore, and price keys
     */
    private static Map<String, Object> scoreIsEnough(UtilRecords.dispatchRequestBody requestBody) {

        // Calculate dispatch price first
        Double dispatchPrice = calculateDispatchPrice(requestBody);

        // Calculate remaining score after cost deduction
        double costAfterPay = requestBody.userDispatchScore() - dispatchPrice;

        Map<String, Object> response = new HashMap<>();

        // Boolean flag if user has enough score
        response.put("isEnough", costAfterPay > 0);

        // The resulting user score after payment
        response.put("finalUserScore", costAfterPay);

        // The cost price of the dispatch
        response.put("price", dispatchPrice);

        return response;
    }

    /**
     * Calculate refund amount when canceling an ongoing dispatch.
     * Refund is proportional to unused time plus a 10% refundable flat fee.
     * @param dispatch the dispatch model being cancelled
     * @return refund amount as Double
     */
    public Double calculateOngoingRefund(DispatchModel dispatch) {

        LocalDateTime startTime  = dispatch.getDispatchStartTime();  // When dispatch started
        LocalDateTime cancelTime = LocalDateTime.now();             // Current cancellation time
        LocalDateTime endTime    = dispatch.getDispatchEndTime();   // Scheduled end time

        // Validate presence of times and that cancellation happens before end
        if (startTime == null || endTime == null) return 0.0;
        if (cancelTime.isAfter(endTime)) return 0.0;
        if (cancelTime.isBefore(startTime)) return 0.0;

        // Calculate total duration and remaining duration in minutes
        long totalDurationMinutes = Duration.between(startTime, endTime).toMinutes();
        long remainingMinutes     = Duration.between(cancelTime, endTime).toMinutes();

        if (totalDurationMinutes <= 0 || remainingMinutes <= 0) return 0.0;

        // Ratio of unused time
        double unusedRatio = (double) remainingMinutes / totalDurationMinutes;

        // Recalculate total hours for pricing
        long totalHours = Duration.between(startTime, endTime).toHours();

        // Calculate refundable amount based on unused time and flat fees
        return getRefundable(dispatch, totalHours, unusedRatio);
    }

    /**
     * Helper method to calculate refundable amount based on total hours and unused ratio.
     * Includes 10% of flat fees as refundable.
     */
    private static double getRefundable(DispatchModel dispatch, long totalHours, double unusedRatio) {
        double halfDayBlocks = Math.ceil(totalHours / 12.0);
        double totalDays = halfDayBlocks * 0.5;

        double timeBasedCost = totalDays * costPerDay;

        // Flat fees for vehicle class
        double vehicleClassScore = switch (dispatch.getVehicleClass()) {
            case CLASSIFIED -> 1000;
            case CARGO      -> 300;
            case REGULAR    -> 200;
            case TRANSPORT  -> 400;
        };

        // Flat fees for dispatch reason
        double dispatchReasonScore = switch (dispatch.getDispatchReason()) {
            case CLASSIFIED -> 1000;
            case DELIVERY   -> 200;
            case TRANSPORT  -> 150;
        };

        double flatFees = vehicleClassScore + dispatchReasonScore;

        // Refundable flat portion is 10% of flat fees
        double refundableFlat = flatFees * 0.1;

        // Total refundable = unused time cost + refundable flat portion
        return (timeBasedCost * unusedRatio) + refundableFlat;
    }

    /**
     * Validates whether a dispatch is still valid (not expired or cancelled).
     * Throws ConflictException if invalid.
     * @param dispatch the DispatchModel to validate
     * @return true if valid, exception otherwise
     */
    private static Boolean isStillValidDispatch(DispatchModel dispatch) {
        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED ){
            throw new ConflictException("Dispatch not found in staging must be expired");
        }

        LocalDateTime endTime = dispatch.getDispatchEndTime();
        LocalDateTime now = LocalDateTime.now();

        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED ){
            throw new ConflictException("Dispatch not found in staging Dispatch is Cancelled");
        }

        if (endTime != null && endTime.isBefore(now)) {
            throw new ConflictException("Dispatch has already ended.");
        }
        return true;
    }


}
