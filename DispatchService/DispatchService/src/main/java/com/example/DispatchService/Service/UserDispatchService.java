package com.example.DispatchService.Service;


import com.example.DispatchService.Exceptions.ConflictException;
import com.example.DispatchService.Exceptions.InvalidRequestException;
import com.example.DispatchService.Exceptions.NotFoundException;
import com.example.DispatchService.Models.DispatchModel;
import com.example.DispatchService.Repositories.DispatchRepository;
import com.example.DispatchService.Utils.DispatchEnums;
import com.example.DispatchService.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UserDispatchService {

    private final DispatchRepository dispatchRepository;

    public UserDispatchService(DispatchRepository dispatchRepository) {
        this.dispatchRepository = dispatchRepository;
    }


    /**  creating a dispatch requesting for one  **/

    @Transactional
    public DispatchModel requestVehicleDispatch(UtilRecords.dispatchRequestBody requestBody,String userName ,List<String> userRole){

       List<DispatchModel> foundVehicleDispatches = dispatchRepository.findByDispatchVehicleId(requestBody.dispatchVehicleId());

       for (DispatchModel dispatchModel : foundVehicleDispatches){

           if(
           dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED ||
           dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED ||
           dispatchModel.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED
           ){continue;}


           if(dispatchModel.getDispatchStatus().equals(DispatchEnums.DispatchStatus.PENDING)) {
            throw new InvalidRequestException("Vehicle already requested by another user", 401);
           }

           if(dispatchModel.getDispatchStatus().equals(DispatchEnums.DispatchStatus.IN_PROGRESS)) {
               throw new InvalidRequestException("The current vehicle is already in dispatch and cannot be booked", 401);
           }
       }


        DispatchModel finalDispatchBody = getDispatchModel(requestBody, userName, userRole);
       return dispatchRepository.save(finalDispatchBody);
    }


    /** canceling a dispatch (user(dispatch requester)) **/

    @Transactional
    public DispatchModel userCancelingDispatch(String userName ,List<String> userRole, int dispatchId){

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

                dispatch.addToDispatchMetadata("DispatchRequester", dispatch.getDispatchRequester());
                dispatch.addToDispatchMetadata("vehicleId", dispatch.getDispatchVehicleId());
                dispatch.addToDispatchMetadata("status", dispatch.getDispatchStatus().name());
                dispatch.addToDispatchMetadata("expiresInMinutes", remainingTime.toMinutes());
                dispatch.addToDispatchMetadata("expiresInHours", remainingTime.toHours());
                dispatchRepository.save(dispatch);
                allMyDispatches.add(dispatch);
            }
        }
       return  allMyDispatches;
    }



    @Transactional
    public Map<String, Object>  revalidateDispatchById(String user,int dispatchId){


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

            dispatch.addToDispatchMetadata("DispatchRequester", dispatch.getDispatchRequester());
            dispatch.addToDispatchMetadata("vehicleId", dispatch.getDispatchVehicleId());
            dispatch.addToDispatchMetadata("status", dispatch.getDispatchStatus().name());
            dispatch.addToDispatchMetadata("expiresInMinutes", remainingTime.toMinutes());
            dispatch.addToDispatchMetadata("expiresInHours", remainingTime.toHours());
            dispatchRepository.save(dispatch);
        }
        return dispatch.getDispatchMetadata();
    }




    /** Util static methods  (im too lazy to create a file for it) **/

    private static DispatchModel getDispatchModel(UtilRecords.dispatchRequestBody requestBody, String userName, List<String> userRole) {
        DispatchModel finalDispatchBody = new DispatchModel();
        finalDispatchBody.setDispatchVehicleId(requestBody.dispatchVehicleId());
        finalDispatchBody.setDispatchRequesterRole(userRole);
        finalDispatchBody.setDispatchRequester(userName);
        finalDispatchBody.setDispatchReason(requestBody.dispatchReason());
        finalDispatchBody.setDispatchStatus(DispatchEnums.DispatchStatus.PENDING);
        finalDispatchBody.setVehicleClass(requestBody.vehicleClass());
        finalDispatchBody.setDispatchEndTime(requestBody.dispatchEndTime());
        return finalDispatchBody;
    }



    private static boolean isStillValidDispatch(DispatchModel dispatch) {
        if(!dispatch.getDispatchAdmin().isEmpty()){
        throw  new ConflictException("This dispatch is already tracked by another admin");}

        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED ){
        throw new NotFoundException("Dispatch not found in staging must be expired");
        }
        if(dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED ){
            throw new NotFoundException("Dispatch not found in staging Dispatch is Cancelled");
        }
        return true;
    }
}
