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
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.example.DispatchService.Utils.DispatchEnums.DispatchReason.CLASSIFIED;
import static com.example.DispatchService.Utils.DispatchEnums.DispatchReason.TRANSPORT;
import static com.example.DispatchService.Utils.DispatchEnums.DispatchStatus.ONGOING;
import static com.example.DispatchService.Utils.DispatchEnums.VehicleStatus.CARGO;
import static com.example.DispatchService.Utils.DispatchEnums.VehicleStatus.REGULAR;

@Service
public class UserDispatchService {

    private final DispatchRepository dispatchRepository;
    private final Logger logger = LoggerFactory.getLogger(UserDispatchService.class);


    private final ResponseMapperService dispatchResponseMapper;
    private final MessagingService messagingService;


    static double costPerDay = 500;


    public UserDispatchService(DispatchRepository dispatchRepository, ResponseMapperService dispatchResponseMapper, MessagingService messagingService) {
        this.dispatchRepository = dispatchRepository;
        this.dispatchResponseMapper = dispatchResponseMapper;
        this.messagingService = messagingService;
    }


    /**  creating a dispatch requesting for one  **/

    @Transactional
    public
    //UtilRecords.DispatchResponseDTO
            DispatchModel requestVehicleDispatch(UtilRecords.dispatchRequestBody requestBody, String userName,String userImage , List<String> userRole) {

        DispatchModel dispatchFinalModel = new DispatchModel();
        Boolean canDispatch = false;

        List<DispatchModel> foundVehicleDispatches = dispatchRepository.findByDispatchVehicleId(requestBody.vehicleIdentificationNumber());

        System.out.println(foundVehicleDispatches);


        for (DispatchModel dispatchModel : foundVehicleDispatches) {
            if (
                    dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED ||
                            dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED ||
                            dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED
            ) {
                continue;
            }


            if (dispatchModel.getDispatchStatus().equals(DispatchEnums.DispatchStatus.PENDING)) {
                throw new InvalidRequestException("Vehicle already requested by another user", 403);
            }

            if (dispatchModel.getDispatchStatus().equals(ONGOING)) {
                throw new InvalidRequestException("The current vehicle is already in dispatch an ongoing dispatch", 403);
            }

            if (dispatchModel.getDispatchStatus().equals(DispatchEnums.DispatchStatus.IN_PROGRESS)) {
                throw new InvalidRequestException("The current vehicle is already staged for dispatch and cannot be booked", 403);
            }
        }

        if(!(boolean) scoreIsEnough(requestBody).get("isEnough")){
            throw new InvalidRequestException("Your Score is Too Low For Dispatch", 403);
        }

        UtilRecords.dispatchRequestBodyDTO requestBodyDTO
                = new UtilRecords.dispatchRequestBodyDTO(requestBody.vehicleName(),requestBody.vehicleIdentificationNumber(),requestBody.vehicleStatus(),requestBody.dispatchReason(),userName,requestBody.dispatchEndTime(), null);



        Map<String, Object> dispatchResult = (Map<String, Object>) messagingService.sendDispatchRequestedEvent(requestBodyDTO);
        System.out.println(dispatchResult);
        if (dispatchResult.containsKey("canDispatch")) {
            canDispatch = (Boolean) dispatchResult.get("canDispatch");
        }


        UtilRecords.DispatchResponseDTO finalResponse = dispatchResponseMapper.dispatchResponseMapper(dispatchResult);


        DispatchModel finalDispatchModel = getDispatchModel(finalResponse,userName,userRole,userImage,requestBody);

        DispatchModel savedModel =  dispatchRepository.save(finalDispatchModel);
        Object rawScore = scoreIsEnough(requestBody).get("finalUserScore");
        double finalScore = rawScore instanceof Number ? ((Number) rawScore).doubleValue() : 0.0;
        double negatedScore = -finalScore;

        UtilRecords.DispatchScoreUpdateDto userScoreUpdate = new UtilRecords.DispatchScoreUpdateDto(requestBody.dispatchRequester(),savedModel.getDispatchId(), negatedScore);


        messagingService.updateUserScore(userScoreUpdate);

        UtilRecords.dispatchRequestBodyDTO finalDispatchDto
                = new UtilRecords.dispatchRequestBodyDTO(savedModel.getVehicleName(),savedModel.getDispatchVehicleId(),savedModel.getVehicleClass(),savedModel.getDispatchReason(),userName,requestBody.dispatchEndTime(), savedModel.getDispatchId());


        messagingService.sendDispatchCreatedEventNoResponse(finalDispatchDto);
        return savedModel;
    }



    /** canceling a dispatch (user(dispatch requester)) **/

    @Transactional
    public DispatchModel userCancelingDispatch(String userName ,List<String> userRole, Long dispatchId){

        if(userRole.isEmpty()){
            throw new InvalidRequestException("No user role provided", 400);}


        DispatchModel dispatch = dispatchRepository.findByDispatchIdAndDispatchRequester(dispatchId,userName);

        if(dispatch == null){
            throw new NotFoundException("No Dispatch Connected to that user is found");
        }

        if(!isStillValidDispatch(dispatch)){
            return null;
        }

        if(!dispatch.getDispatchRequester().equals(userName)){
            throw new InvalidRequestException("An external user cannot cancel another user's dispatch", 400);
        }

        if(dispatch.getDispatchStatus() == ONGOING){
            Double userRefund  = calculateOngoingRefund(dispatch);
            UtilRecords.DispatchScoreUpdateDto userScoreUpdate = new UtilRecords.DispatchScoreUpdateDto(userName,dispatchId, userRefund);
            messagingService.updateUserScore(userScoreUpdate);


            dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.CANCELLED);
            UtilRecords.DispatchEndedDTO dispatchEnded = new UtilRecords.DispatchEndedDTO(true,LocalDateTime.now(),dispatch.getDispatchVehicleId(),userName,dispatch.getVehicleName(),dispatchId);

            messagingService.sendDispatchCompletedFanoutFromDispatchService(
                    dispatchEnded);
            return dispatchRepository.save(dispatch);
        }


        dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.CANCELLED);
        UtilRecords.DispatchEndedDTO dispatchEnded = new UtilRecords.DispatchEndedDTO(true,LocalDateTime.now(),dispatch.getDispatchVehicleId(),userName,dispatch.getVehicleName(),dispatchId);
        messagingService.sendDispatchCompletedFanoutFromDispatchService(
                dispatchEnded);
        return dispatchRepository.save(dispatch);
    }






    @Transactional
    public List<DispatchModel>  revalidateMyDispatches(String user){

        List<DispatchModel> userDispatches = dispatchRepository.findAllByDispatchRequester(user);
        List<DispatchModel> allMyDispatches = new ArrayList<>();

        for (DispatchModel dispatch : userDispatches ){
            if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED){
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Expired");
                allMyDispatches.add(dispatch);
            }

            if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED){
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Cancelled");

                allMyDispatches.add(dispatch);

            }

            if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED){
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Completed");

                allMyDispatches.add(dispatch);

            }

            LocalDateTime expiry = dispatch.getDispatchEndTime();
            LocalDateTime now = LocalDateTime.now();

            if (expiry.isBefore(now)) {
                // dispatch just got expired
                dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Expired");

                UtilRecords.DispatchEndedDTO dispatchEnded = new UtilRecords.DispatchEndedDTO(false,LocalDateTime.now(),dispatch.getDispatchVehicleId(),user,dispatch.getVehicleName(),dispatch.getDispatchId());

                messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);


                allMyDispatches.add(dispatch);}



            if (expiry.isAfter(now)) {
                // Still active — calculate time remaining
                Duration remainingTime = Duration.between(now, expiry);

                // Add metadata to result list
                dispatch.addToDispatchMetadata("expiresInMinutes", remainingTime.toMinutes());
                dispatch.addToDispatchMetadata("expiresInHours", remainingTime.toHours());

                allMyDispatches.add(dispatch);
            }
        }
        dispatchRepository.saveAll(allMyDispatches);
       return  allMyDispatches;
    }


    @Transactional
    public List<DispatchModel> revalidateMyActiveDispatches(String user) {


        List<DispatchModel> userDispatches = dispatchRepository.findAllByDispatchRequester(user);

        List<DispatchModel> validDispatches = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();

        for (DispatchModel dispatch : userDispatches) {
            LocalDateTime expiry = dispatch.getDispatchEndTime();


            if (expiry.isBefore(now)) {

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
                dispatchRepository.save(dispatch);
                continue;
            }


            if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED) {
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Cancelled");
                continue;
            }

            if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED) {
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Completed");
                continue;
            }

            Duration remainingTime = Duration.between(now, expiry);
            dispatch.addToDispatchMetadata("expiresInMinutes", remainingTime.toMinutes());
            dispatch.addToDispatchMetadata("expiresInHours", remainingTime.toHours());

            validDispatches.add(dispatch);
        }

        // Save updates (e.g., updated expired statuses)
        dispatchRepository.saveAll(userDispatches);

        return validDispatches;
    }




    @Transactional
    public DispatchModel  revalidateDispatchByIdUserAndVehicleId(String user,Long dispatchId,String vehicleId){

        DispatchModel dispatch = dispatchRepository.findByDispatchRequesterAndDispatchIdAndDispatchVehicleId(user, dispatchId, vehicleId);


        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED){
            dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Expired");
            dispatchRepository.save(dispatch);
            return dispatch;
        }

        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED){
            dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Cancelled");
            dispatchRepository.save(dispatch);
            return dispatch;
        }

        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED){
            dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Completed");
            dispatchRepository.save(dispatch);
            return dispatch;
        }

        LocalDateTime expiry = dispatch.getDispatchEndTime();
        LocalDateTime now = LocalDateTime.now();

        if (expiry.isBefore(now)) {
            // dispatch just got expired
            dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
            dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Expired");
            dispatchRepository.save(dispatch);
            return dispatch;
        }

        if (expiry.isAfter(now)) {
            // Still active — calculate time remaining
            Duration remainingTime = Duration.between(now, expiry);

            // Add metadata to result list
             dispatch.addToDispatchMetadata("expiresInMinutes", remainingTime.toMinutes());
            dispatch.addToDispatchMetadata("expiresInHours", remainingTime.toHours());
            dispatchRepository.save(dispatch);
              return dispatch;
        }
        return dispatch;
    }


    public DispatchModel getMyDispatchByVinAndId(@Valid Long dispatchId, String currentUser, @Valid String vin) {
        return dispatchRepository
                .findByDispatchIdAndDispatchRequesterAndDispatchVehicleId(dispatchId, currentUser, vin)
                .orElseThrow(() -> new NotFoundException("Dispatch Doesn't exist"));}


    @Transactional
    public void completeDispatch(UtilRecords.DispatchEndedDTO dispatchEnded){

        DispatchModel dispatch = dispatchRepository
            .findByDispatchIdAndDispatchRequester(dispatchEnded.dispatchId(),dispatchEnded.receiver());


        if(!isStillValidDispatch(dispatch)){
            logger.error("The dispatch is not even valid before");
        }

        if(!dispatch.getDispatchRequester().equals(dispatchEnded.receiver())){
            throw new InvalidRequestException("Uhm how did this even happen", 400);
        }
        dispatch.addToDispatchMetadata("dispatchCompleteStatus", "Your dispatch has been completed");
        dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.COMPLETED);
        dispatch.setDispatchEndTime(dispatchEnded.timeStamp());

    }


    public void handleDispatchTracking(UtilRecords.StartTrackingDTO trackingEvent) {
        DispatchModel foundUserDispatch = dispatchRepository.findByDispatchId(trackingEvent.dispatchId());

        if(foundUserDispatch == null){
            throw new NotFoundException("Dispatch not found");
        }


        if(!foundUserDispatch.getDispatchRequester().equals(trackingEvent.dispatchRequester())){
            throw new ConflictException("User not valid for tracking external dispatch");
        }

        if (!isStillValidDispatch(foundUserDispatch)) {
        throw new ConflictException("The dispatch is not valid for tracking");
        }


        foundUserDispatch.setDispatchStatus(ONGOING);
        foundUserDispatch.setDispatchStartTime(LocalDateTime.now());

        // new scoree depending on the dispatch when it is actually like given out
        UtilRecords.dispatchRequestBody dispatchRequest = new UtilRecords.dispatchRequestBody(foundUserDispatch.getVehicleName(),foundUserDispatch.getDispatchVehicleId(),foundUserDispatch.getVehicleClass(),foundUserDispatch.getDispatchReason(),foundUserDispatch.getDispatchRequester(),0.0,foundUserDispatch.getDispatchEndTime(),LocalDateTime.now());

        // making the difference and returning the excess dispatch points
        Double dispatchNewPrice  = calculateDispatchPrice(dispatchRequest);
        Double oldPrice = foundUserDispatch.getDispatchCost();
        Double discountDifference =  oldPrice - dispatchNewPrice;
        foundUserDispatch.setDispatchCost(dispatchNewPrice);

        UtilRecords.DispatchScoreUpdateDto userScoreUpdate = new UtilRecords.DispatchScoreUpdateDto(foundUserDispatch.getDispatchRequester(),foundUserDispatch.getDispatchId(), discountDifference);
        messagingService.updateUserScore(userScoreUpdate);
        dispatchRepository.save(foundUserDispatch);
    }



    @Transactional
    public DispatchModel setDispatchRating(Double rating, Long dispatchId, String username){

        DispatchModel dispatch = dispatchRepository
                .findByDispatchIdAndDispatchRequester(dispatchId,username);
        if(!dispatch.getDispatchRequester().equals(username)){
            throw new InvalidRequestException("Why are you rating another person's dispatch", 400);
        }
        dispatch.setDispatchReviewScore(rating);
        return dispatchRepository.save(dispatch);
    }


    /** Util static methods  (its minimal so it's redundant to create a file for it) **/

    private static DispatchModel getDispatchModel(
    UtilRecords.DispatchResponseDTO requestBody,
    String userName, List<String> roles,String userImage,
    UtilRecords.dispatchRequestBody dispatchRequestBody) {

        DispatchModel finalDispatchBody = new DispatchModel();
        finalDispatchBody.setDispatchVehicleId(dispatchRequestBody.vehicleIdentificationNumber());
        finalDispatchBody.setDispatchRequesterRole(roles);
        finalDispatchBody.setUserImage(userImage);
        finalDispatchBody.setVehicleImage(requestBody.vehicleImage().getFirst());
        finalDispatchBody.setDispatchRequester(userName);
        finalDispatchBody.setDispatchReason(dispatchRequestBody.dispatchReason());
        finalDispatchBody.setDispatchStatus(DispatchEnums.DispatchStatus.PENDING);
        finalDispatchBody.setDispatchRequestTime(dispatchRequestBody.dispatchRequestTime());
        finalDispatchBody.setVehicleClass(dispatchRequestBody.vehicleStatus());
        finalDispatchBody.setDispatchEndTime(dispatchRequestBody.dispatchEndTime());
        finalDispatchBody.setVehicleName(dispatchRequestBody.vehicleName());
        finalDispatchBody.setCanDispatch(requestBody.canDispatch());
        finalDispatchBody.setHealthAttributes(requestBody.healthAttributes());
        finalDispatchBody.setWildCards(requestBody.wildCards());
        finalDispatchBody.setSafetyScore(requestBody.safetyScore());
        return finalDispatchBody;
    }



    public static Double calculateDispatchPrice(UtilRecords.dispatchRequestBody dispatchRequestBody) {

        double vehicleClassScore = 0;
        double totalScoreForDays = 0;
        double dispatchReasonScore = 0;

        long totalHours = Duration.between(dispatchRequestBody.dispatchRequestTime(), dispatchRequestBody.dispatchEndTime()).toHours();

        double halfDayBlocks = Math.ceil(totalHours / 12.0);
        double totalDays = (halfDayBlocks * 0.5);
        totalScoreForDays = (totalDays * costPerDay);


        if(dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.CLASSIFIED){
            vehicleClassScore = 1000;
        }else if(dispatchRequestBody.vehicleStatus() == CARGO){
            vehicleClassScore = 300;
        }else if(dispatchRequestBody.vehicleStatus() == REGULAR){
            vehicleClassScore = 200;
        }else if(dispatchRequestBody.vehicleStatus() == DispatchEnums.VehicleStatus.TRANSPORT){
            vehicleClassScore = 400;
        }


        if(dispatchRequestBody.dispatchReason() == CLASSIFIED){
            dispatchReasonScore = 1000;
        }else if(dispatchRequestBody.dispatchReason() == DispatchEnums.DispatchReason.DELIVERY){
            dispatchReasonScore = 200;
        }else if(dispatchRequestBody.dispatchReason() == TRANSPORT){
            dispatchReasonScore = 150;
        }

        return dispatchReasonScore + vehicleClassScore + totalScoreForDays;
    }



    private static    Map<String, Object> scoreIsEnough(UtilRecords.dispatchRequestBody requestBody) {

        Double dispatchPrice = calculateDispatchPrice(requestBody);

        double costAfterPay = requestBody.userDispatchScore() - dispatchPrice;

        Map<String, Object> response = new HashMap<>();

       response.put("isEnough", costAfterPay > 0);
       response.put("finalUserScore", costAfterPay);
       response.put("price", dispatchPrice);
       return response;
    }
    public Double calculateOngoingRefund(DispatchModel dispatch) {

        LocalDateTime startTime  = dispatch.getDispatchStartTime(); // more generous
        LocalDateTime cancelTime = LocalDateTime.now();
        LocalDateTime endTime    = dispatch.getDispatchEndTime();

        // Validate
        if (startTime == null || endTime == null) return 0.0;
        if (cancelTime.isAfter(endTime)) return 0.0;
        if (cancelTime.isBefore(startTime)) return 0.0;

        // Time-based calculations
        long totalDurationMinutes = Duration.between(startTime, endTime).toMinutes();
        long remainingMinutes     = Duration.between(cancelTime, endTime).toMinutes();

        if (totalDurationMinutes <= 0 || remainingMinutes <= 0) return 0.0;

        double unusedRatio = (double) remainingMinutes / totalDurationMinutes;

        // Recalculate original time-based cost
        long totalHours = Duration.between(startTime, endTime).toHours();

        return getRefundable(dispatch, totalHours, unusedRatio);
    }


    private static double getRefundable(DispatchModel dispatch, long totalHours, double unusedRatio) {
        double halfDayBlocks = Math.ceil(totalHours / 12.0);
        double totalDays = halfDayBlocks * 0.5;
        double timeBasedCost = totalDays * costPerDay;

        // Flat fees based on vehicle status and reason
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


    private static Boolean isStillValidDispatch(DispatchModel dispatch) {
        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED ){
        throw new ConflictException("Dispatch not found in staging must be expired");
        }

        LocalDateTime endTime     = dispatch.getDispatchEndTime();
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
