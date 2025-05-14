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

public class AdminDispatchService {
    private final DispatchRepository dispatchRepository;

    public AdminDispatchService(DispatchRepository dispatchRepository) {
        this.dispatchRepository = dispatchRepository;
    }



    /**  admin validating a dispatch  **/

    @Transactional
    public DispatchModel validateDispatch(String userName , List<String> userRole, int dispatchId){

        if(userRole.isEmpty()){
            throw new InvalidRequestException("No user role provided", 400);}

        if(!userRole.contains(String.valueOf("ROLE_ADMIN"))){
            throw new InvalidRequestException("Not a valid user for this request", 400);}

        DispatchModel dispatch = dispatchRepository.findByDispatchId(dispatchId);


        if(!isStillValidDispatch(dispatch)){
            return null;
        }

        dispatch.setDispatchAdmin(userName);
        dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.IN_PROGRESS);
        dispatch.setDispatchRequestApproveTime(LocalDateTime.now());
        return dispatchRepository.save(dispatch);
    }




    /**  canceling a dispatch (admin) **/

    @Transactional
    public DispatchModel cancelDispatch(String userName ,List<String> userRole, int dispatchId, String dispatchCancelReason){

        if(userRole.isEmpty()){
            throw new InvalidRequestException("No user role provided", 400);}

        if(!userRole.contains(String.valueOf("ROLE_ADMIN"))){
            throw new InvalidRequestException("Not a valid user for this request", 400);}

        DispatchModel dispatch = dispatchRepository.findByDispatchId(dispatchId);

        if(!isStillValidDispatch(dispatch)){
            return null;}

        if(dispatchCancelReason.isEmpty()){
            dispatch.addToDispatchMetadata("dispatchApprovalStatus", "Dispatch cancelled by admin");
        }

        dispatch.addToDispatchMetadata("dispatchApprovalStatus", dispatchCancelReason);
        dispatch.setDispatchAdmin(userName);
        dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.CANCELLED);
        dispatch.setDispatchRequestApproveTime(LocalDateTime.now());
        return dispatchRepository.save(dispatch);
    }



    @Transactional
    public List<DispatchModel>  revalidateAllActiveDispatch(){

        List<DispatchModel> foundVehicleDispatches = dispatchRepository.findAll();
        List<DispatchModel> activeDispatchMetadata = new ArrayList<>();

        for(DispatchModel dispatch : foundVehicleDispatches ){
            if(
                    dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED ||
                    dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED ||
                    dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED
            ){
                continue;}

            LocalDateTime expiry = dispatch.getDispatchEndTime();
            LocalDateTime now = LocalDateTime.now();


            if (expiry.isBefore(now)) {
                dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
            }

            if (expiry.isAfter(now)) {

                // Still active — calculate time remaining
                Duration remainingTime = Duration.between(now, expiry);


                dispatch.addToDispatchMetadata("DispatchRequester", dispatch.getDispatchRequester());
                dispatch.addToDispatchMetadata("DispatchId", dispatch.getDispatchId());

                dispatch.addToDispatchMetadata("vehicleId", dispatch.getDispatchVehicleId());
                dispatch.addToDispatchMetadata("status", dispatch.getDispatchStatus().name());
                dispatch.addToDispatchMetadata("expiresInMinutes", remainingTime.toMinutes());
                dispatch.addToDispatchMetadata("expiresInHours", remainingTime.toHours());
                activeDispatchMetadata.add(dispatch);
                dispatchRepository.save(dispatch);
            }

        }
        return activeDispatchMetadata;
    }









    public List<DispatchModel> getAllDispatch(){
        return   dispatchRepository.findAll();
    }






    /** Util static methods  (im too lazy to create a file for it) **/

    private static DispatchModel getDispatchModel(UtilRecords.dispatchRequestBody requestBody, String userName, List<String> userRole) {
        DispatchModel finalDispatchBody = new DispatchModel();
        finalDispatchBody.setDispatchVehicleId(requestBody.vehicleIdentificationNumber());
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
