package com.example.DispatchService.Service;


import com.example.DispatchService.Exceptions.ConflictException;
import com.example.DispatchService.Exceptions.InvalidRequestException;
import com.example.DispatchService.Exceptions.NotFoundException;
import com.example.DispatchService.Models.DispatchModel;
import com.example.DispatchService.RabbitMq.RabbitMqSenderService;
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
import java.util.Map;

@Service

public class AdminDispatchService {
    private final DispatchRepository dispatchRepository;

    private final RabbitMqSenderService rabbitMqSenderService;

    public AdminDispatchService(DispatchRepository dispatchRepository, RabbitMqSenderService rabbitMqSenderService) {
        this.dispatchRepository = dispatchRepository;
        this.rabbitMqSenderService = rabbitMqSenderService;
    }



    /**  admin validating a dispatch  **/

    @Transactional
    public DispatchModel validateDispatch(String adminEmail , List<String> userRole, Long dispatchId){

        if(userRole.isEmpty()){
            throw new InvalidRequestException("No user role provided", 400);}

        if(!userRole.contains(String.valueOf("ROLE_ADMIN"))){
            throw new InvalidRequestException("Not a valid user for this request", 400);}

        DispatchModel dispatch = dispatchRepository.findByDispatchId(dispatchId);

        if(dispatch == null){
            throw new NotFoundException("Dispatch Not found ooo");
        }

        if(!isStillValidDispatch(dispatch)){
            return null;
        }

        dispatch.setDispatchAdmin(adminEmail);
        dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.IN_PROGRESS);
        dispatch.setDispatchRequestApproveTime(LocalDateTime.now());

        UtilRecords.ValidatedDispatch dispatchValidatedBroadcast = new UtilRecords.ValidatedDispatch(dispatch.getDispatchId(), dispatch.getVehicleName(), dispatch.getDispatchReason(),dispatch.getDispatchVehicleId(),dispatch.getDispatchRequester(),dispatch.getDispatchAdmin(),dispatch.getDispatchEndTime());

        rabbitMqSenderService.sendDispatchValidatedNoResponse(dispatchValidatedBroadcast);

        return dispatchRepository.save(dispatch);
    }




    /**  canceling a dispatch (admin) **/

    @Transactional
    public DispatchModel cancelDispatch(String adminEmail ,List<String> userRole, Long dispatchId, String dispatchCancelReason){

        if(userRole.isEmpty()){
            throw new InvalidRequestException("No user role provided", 400);}

        if(!userRole.contains(String.valueOf("ROLE_ADMIN"))){
            throw new InvalidRequestException("Not a valid user for this request", 400);}

        DispatchModel dispatch = dispatchRepository.findByDispatchId(dispatchId);


        if(dispatch == null){
            throw new NotFoundException("Dispatch NNof found ooo");
        }


        if(!isStillValidDispatch(dispatch)){
            return null;}

        if(dispatchCancelReason.isEmpty()){
            dispatch.addToDispatchMetadata("dispatchApprovalStatus", "Dispatch cancelled by admin");
        }
        UtilRecords.DispatchEndedDTO dispatchEndedDTO = new UtilRecords.DispatchEndedDTO(true,LocalDateTime.now(),dispatch.getDispatchVehicleId(),dispatch.getDispatchRequester(),dispatch.getVehicleName(),dispatchId);

        rabbitMqSenderService.sendDispatchCompletedFanoutFromDispatchService(dispatchEndedDTO);

        dispatch.addToDispatchMetadata("dispatchApprovalStatus", dispatchCancelReason);
        dispatch.setDispatchAdmin(adminEmail);
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




    @Transactional
    public DispatchModel revalidateDispatchByIdAndVehicleId(@Valid Long dispatchId, String vehicleId) {
        DispatchModel dispatch = dispatchRepository.findByDispatchIdAndDispatchVehicleId( dispatchId, vehicleId);

        if(dispatch == null){
            throw new NotFoundException("Dispatch Not found ooo");
        }

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




    public List<DispatchModel> getAllDispatch(){
        return   dispatchRepository.findAll();
    }



    public List<DispatchModel> getVehicleHistory(String vehicleId){

        return   dispatchRepository.findByDispatchVehicleId(vehicleId);
    }







    /** Util static methods  (im too lazy to create a file for it) **/

    private static DispatchModel getDispatchModel(UtilRecords.dispatchRequestBody requestBody, String adminEmail, List<String> userRole) {
        DispatchModel finalDispatchBody = new DispatchModel();
        finalDispatchBody.setDispatchVehicleId(requestBody.vehicleIdentificationNumber());
        finalDispatchBody.setDispatchRequesterRole(userRole);
        finalDispatchBody.setDispatchRequester(adminEmail);
        finalDispatchBody.setDispatchReason(requestBody.dispatchReason());
        finalDispatchBody.setDispatchStatus(DispatchEnums.DispatchStatus.PENDING);
        finalDispatchBody.setVehicleClass(requestBody.vehicleStatus());
        finalDispatchBody.setDispatchEndTime(requestBody.dispatchEndTime());
        return finalDispatchBody;
    }





    private static boolean isStillValidDispatch(DispatchModel dispatch) {
        if(dispatch.getDispatchAdmin() != null){
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
