package com.example.DispatchService.Service;


import com.example.DispatchService.Exceptions.ConflictException;
import com.example.DispatchService.Exceptions.InvalidRequestException;
import com.example.DispatchService.Exceptions.NotFoundException;
import com.example.DispatchService.Models.DispatchModel;
import com.example.DispatchService.RabbitMq.RabbitMqSenderService;
import com.example.DispatchService.RabbitMq.ResponseMapperService;
import com.example.DispatchService.Repositories.DispatchRepository;
import com.example.DispatchService.Utils.DispatchEnums;
import com.example.DispatchService.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UserDispatchService {

    private final DispatchRepository dispatchRepository;
    private final Logger logger = LoggerFactory.getLogger(UserDispatchService.class);

    @Autowired
    private ResponseMapperService mapperService;
    @Autowired
    private RabbitMqSenderService rabbitMqSenderService;

    public UserDispatchService(DispatchRepository dispatchRepository) {
        this.dispatchRepository = dispatchRepository;
    }


    /**  creating a dispatch requesting for one  **/

    @Transactional
    public UtilRecords.DispatchResponseDTO requestVehicleDispatch(UtilRecords.dispatchRequestBody requestBody, String userName , List<String> userRole) {

        DispatchModel dispatchFinalModel = new DispatchModel();
        Boolean canDispatch = false;

        List<DispatchModel> foundVehicleDispatches = dispatchRepository.findByDispatchVehicleId(requestBody.vehicleIdentificationNumber());

        for (DispatchModel dispatchModel : foundVehicleDispatches) {
            if (
                    dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED ||
                            dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED ||
                            dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED
            ) {
                continue;
            }


            if (dispatchModel.getDispatchStatus().equals(DispatchEnums.DispatchStatus.PENDING)) {
                throw new InvalidRequestException("Vehicle already requested by another user", 401);
            }

            if (dispatchModel.getDispatchStatus().equals(DispatchEnums.DispatchStatus.IN_PROGRESS)) {
                throw new InvalidRequestException("The current vehicle is already in dispatch and cannot be booked", 401);
            }
        }

        Map<String, Object> dispatchResult = (Map<String, Object>) rabbitMqSenderService.sendDispatchCreatedEvent(requestBody);

        if (dispatchResult.containsKey("canDispatch")) {
            canDispatch = (Boolean) dispatchResult.get("canDispatch");
        }
        rabbitMqSenderService.sendDispatchCreatedEventNoResponse(requestBody);

        UtilRecords.DispatchResponseDTO finalResponse = mapperService.dispatchResponseMapper(dispatchResult);

        DispatchModel finalDispatchModel = getDispatchModel(finalResponse,userName,userRole,requestBody);

        dispatchRepository.save(finalDispatchModel);

        return finalResponse;
    }


    /** canceling a dispatch (user(dispatch requester)) **/

    @Transactional
    public DispatchModel userCancelingDispatch(String userName ,List<String> userRole, Long dispatchId){

        if(userRole.isEmpty()){
            throw new InvalidRequestException("No user role provided", 400);}


        DispatchModel dispatch = dispatchRepository.findByDispatchIdAndDispatchRequester(dispatchId,userName);


        if(!isStillValidDispatch(dispatch)){
            return null;
        }

        if(!dispatch.getDispatchRequester().equals(userName)){
            throw new InvalidRequestException("An external user cannot cancel another user's dispatch", 400);
        }

        dispatch.addToDispatchMetadata("dispatchApprovalStatus", "Your dispatch has been canceled");
        dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.CANCELLED);
        dispatch.setDispatchRequestApproveTime(LocalDateTime.now());
        return dispatchRepository.save(dispatch);
    }






    @Transactional
    public List<DispatchModel>  revalidateMyDispatches(String user){

        List<DispatchModel> userDispatches = dispatchRepository.findAllByDispatchRequester(user);
        List<DispatchModel> allMyDispatches = new ArrayList<>();

        for (DispatchModel dispatch : userDispatches ){
            if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED){
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Expired");
                dispatchRepository.save(dispatch);
                allMyDispatches.add(dispatch);
            }

            if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED){
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Cancelled");
                dispatchRepository.save(dispatch);
                allMyDispatches.add(dispatch);

            }

            if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED){
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Completed");
                dispatchRepository.save(dispatch);
                allMyDispatches.add(dispatch);

            }

            LocalDateTime expiry = dispatch.getDispatchEndTime();
            LocalDateTime now = LocalDateTime.now();

            if (expiry.isBefore(now)) {
                // dispatch just got expired
                dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Expired");
                dispatchRepository.save(dispatch);
                allMyDispatches.add(dispatch);
            }

            if (expiry.isAfter(now)) {
                // Still active — calculate time remaining
                Duration remainingTime = Duration.between(now, expiry);

                // Add metadata to result list
                dispatch.addToDispatchMetadata("expiresInMinutes", remainingTime.toMinutes());
                dispatch.addToDispatchMetadata("expiresInHours", remainingTime.toHours());
                dispatchRepository.save(dispatch);
                allMyDispatches.add(dispatch);
            }
        }
       return  allMyDispatches;
    }



    @Transactional
    public Map<String, Object>  revalidateDispatchById(String user,Long dispatchId){


        DispatchModel dispatch = dispatchRepository.findByDispatchRequesterAndDispatchId(user, dispatchId);


        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED){
            dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Expired");
            return dispatch.getDispatchMetadata();
        }

        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED){
            dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Cancelled");
            return dispatch.getDispatchMetadata();
        }

        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED){
            dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Completed");
            return dispatch.getDispatchMetadata();
        }

        LocalDateTime expiry = dispatch.getDispatchEndTime();
        LocalDateTime now = LocalDateTime.now();

        if (expiry.isBefore(now)) {
            // dispatch just got expired
            dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
            dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Expired");
            return dispatch.getDispatchMetadata();
        }

        if (expiry.isAfter(now)) {
            // Still active — calculate time remaining
            Duration remainingTime = Duration.between(now, expiry);

            // Add metadata to result list
             dispatch.addToDispatchMetadata("expiresInMinutes", remainingTime.toMinutes());
            dispatch.addToDispatchMetadata("expiresInHours", remainingTime.toHours());
            dispatchRepository.save(dispatch);
        }
        return dispatch.getDispatchMetadata();
    }



    @Transactional
    public DispatchModel completeDispatch(UtilRecords.DispatchCompletedEvent completedEvent){

        DispatchModel dispatch = dispatchRepository
            .findByDispatchIdAndDispatchRequester(completedEvent.dispatchId(),completedEvent.userName());


        if(!isStillValidDispatch(dispatch)){
            logger.error("The dispatch is not even valid before");
            return null;
        }

        if(!dispatch.getDispatchRequester().equals(completedEvent.userName())){
            System.out.println(completedEvent.userName());
            System.out.println(dispatch.getDispatchRequester());
            throw new InvalidRequestException("Uhm how did this even happen", 400);
        }
        dispatch.addToDispatchMetadata("dispatchCompleteStatus", "Your dispatch has been completed");
        dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.COMPLETED);
        dispatch.setDispatchEndTime(completedEvent.endTime());
        return dispatchRepository.save(dispatch);
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



    /** Util static methods  (im too lazy to create a file for it) **/

    private static DispatchModel getDispatchModel(
    UtilRecords.DispatchResponseDTO requestBody,
    String userName, List<String> roles,
    UtilRecords.dispatchRequestBody dispatchRequestBody) {

        DispatchModel finalDispatchBody = new DispatchModel();
        finalDispatchBody.setDispatchVehicleId(dispatchRequestBody.vehicleIdentificationNumber());
        finalDispatchBody.setDispatchRequesterRole(roles);
        finalDispatchBody.setDispatchRequester(userName);
        finalDispatchBody.setDispatchReason(dispatchRequestBody.dispatchReason());
        finalDispatchBody.setDispatchStatus(DispatchEnums.DispatchStatus.PENDING);
        finalDispatchBody.setDispatchRequestTime(LocalDateTime.now());
        finalDispatchBody.setVehicleClass(dispatchRequestBody.vehicleClass());
        finalDispatchBody.setDispatchEndTime(dispatchRequestBody.dispatchEndTime());
        finalDispatchBody.setVehicleName(dispatchRequestBody.vehicleName());
        finalDispatchBody.setCanDispatch(requestBody.canDispatch());
        finalDispatchBody.setHealthAttributes(requestBody.healthAttributes());
        finalDispatchBody.setWildCards(requestBody.wildCards());
        finalDispatchBody.setSafetyScore(requestBody.safetyScore());
        return finalDispatchBody;
    }



    private static boolean isStillValidDispatch(DispatchModel dispatch) {
        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED ){
        throw new NotFoundException("Dispatch not found in staging must be expired");
        }
        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED ){
            throw new NotFoundException("Dispatch not found in staging Dispatch is Cancelled");
        }
        return true;
    }
}
