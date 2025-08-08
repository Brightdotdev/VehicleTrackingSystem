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

@Service
public class AdminDispatchService {
    private final DispatchRepository dispatchRepository;

    private final MessagingService messagingService;
    static double costPerDay = 500;

    public AdminDispatchService(DispatchRepository dispatchRepository, MessagingService messagingService) {
        this.dispatchRepository = dispatchRepository;
        this.messagingService = messagingService;
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

        messagingService.sendDispatchValidatedNoResponse(dispatchValidatedBroadcast);

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
            throw new NotFoundException("Dispatch not found");
        }


        if(!isStillValidDispatch(dispatch)){
            return null;}


        dispatch.setDispatchAdmin(adminEmail);

        if (dispatch.getDispatchStatus() == ONGOING) {
            Double userRefund = calculateOngoingRefund(dispatch);
            UtilRecords.DispatchScoreUpdateDto userScoreUpdate =
                    new UtilRecords.DispatchScoreUpdateDto(dispatch.getDispatchRequester(), dispatchId, userRefund);
            messagingService.updateUserScore(userScoreUpdate);

            dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.CANCELLED);

            UtilRecords.DispatchEndedDTO dispatchEnded =
                    new UtilRecords.DispatchEndedDTO(true, LocalDateTime.now(),
                            dispatch.getDispatchVehicleId(), dispatch.getDispatchRequester(),
                            dispatch.getVehicleName(), dispatchId);
            messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);
            return dispatchRepository.save(dispatch);
        }


        if (dispatch.getDispatchStatus() == PENDING || dispatch.getDispatchStatus() == IN_PROGRESS) {
            Double fullRefund = dispatch.getDispatchCost();

            UtilRecords.DispatchScoreUpdateDto userScoreUpdate =
                    new UtilRecords.DispatchScoreUpdateDto(dispatch.getDispatchRequester(), dispatchId, fullRefund);

            messagingService.updateUserScore(userScoreUpdate);

            dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.CANCELLED);

            // Notify system of cancellation (user-triggered)
            UtilRecords.DispatchEndedDTO dispatchEnded =
                    new UtilRecords.DispatchEndedDTO(true, LocalDateTime.now(),
                            dispatch.getDispatchVehicleId(), dispatch.getDispatchRequester(),
                            dispatch.getVehicleName(), dispatchId);

            messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);
            return dispatchRepository.save(dispatch);
        }


        throw new InvalidRequestException("Only ONGOING or PENDING dispatches can be cancelled by the user", 400);}



    @Transactional
    public List<DispatchModel>  revalidateAllActiveDispatch(){

        List<DispatchModel> foundVehicleDispatches = dispatchRepository.findAll();
        List<DispatchModel> activeDispatches = new ArrayList<>();

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

                if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.IN_PROGRESS ||
                        dispatch.getDispatchStatus() == PENDING) {

                    // Refund the dispatch cost
                    UtilRecords.DispatchScoreUpdateDto userScoreRefund =
                            new UtilRecords.DispatchScoreUpdateDto(
                                    dispatch.getDispatchRequester(),
                                    dispatch.getDispatchId(),
                                    dispatch.getDispatchCost()
                            );
                    messagingService.updateUserScore(userScoreRefund);
                }

                // Set status to expired and add metadata
                dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
                dispatch.addToDispatchMetadata("DispatchStatus", "Dispatch Is Expired");

                // Notify via dispatch ended fanout
                UtilRecords.DispatchEndedDTO dispatchEnded = new UtilRecords.DispatchEndedDTO(
                        false,
                        now,
                        dispatch.getDispatchVehicleId(),
                        dispatch.getDispatchRequester(),
                        dispatch.getVehicleName(),
                        dispatch.getDispatchId()
                );
                messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEnded);

                // Save changes
                continue;
            }else {
                activeDispatches.add(dispatch);
            }

        }
        dispatchRepository.saveAll(foundVehicleDispatches);
        return activeDispatches;
    }

    @Transactional
    public List<DispatchModel> revalidateAllDispatch() {
        List<DispatchModel> allDispatches = dispatchRepository.findAll();
        List<DispatchModel> returnList = new ArrayList<>();

        for (DispatchModel dispatch : allDispatches) {
            // Skip status update for completed/cancelled dispatches
            if (dispatch.getDispatchStatus() != DispatchEnums.DispatchStatus.COMPLETED &&
                    dispatch.getDispatchStatus() != DispatchEnums.DispatchStatus.CANCELLED) {

                LocalDateTime expiry = dispatch.getDispatchEndTime();
                LocalDateTime now = LocalDateTime.now();

                if (expiry.isBefore(now)) {
                    dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
                }
            }


            if (dispatch.getDispatchStatus() != DispatchEnums.DispatchStatus.COMPLETED &&
                    dispatch.getDispatchStatus() != DispatchEnums.DispatchStatus.CANCELLED) {

                LocalDateTime expiry = dispatch.getDispatchEndTime();
                LocalDateTime now = LocalDateTime.now();

                if (expiry.isBefore(now)) {
                    if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.IN_PROGRESS ||
                            dispatch.getDispatchStatus() == PENDING) {

                        UtilRecords.DispatchScoreUpdateDto userScoreRefund =
                                new UtilRecords.DispatchScoreUpdateDto(
                                        dispatch.getDispatchRequester(),
                                        dispatch.getDispatchId(),
                                        dispatch.getDispatchCost()
                                );
                        messagingService.updateUserScore(userScoreRefund);
                    }

                    dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
                    UtilRecords.DispatchEndedDTO dispatchEndedDTO = new UtilRecords.DispatchEndedDTO(false,LocalDateTime.now(),dispatch.getDispatchVehicleId(),dispatch.getDispatchRequester(),dispatch.getVehicleName(),dispatch.getDispatchId());
                    messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEndedDTO);

                }}
        }
        return dispatchRepository.saveAll(allDispatches);
    }





    @Transactional
    public DispatchModel revalidateDispatchByIdAndVehicleId(@Valid Long dispatchId, String vehicleId) {
        DispatchModel dispatch = dispatchRepository.findByDispatchIdAndDispatchVehicleId( dispatchId, vehicleId);

        if(dispatch == null){
            throw new NotFoundException("Dispatch Not found ooo");
        }

        LocalDateTime expiry = dispatch.getDispatchEndTime();
        LocalDateTime now = LocalDateTime.now();

        if (expiry.isBefore(now)) {

            if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.IN_PROGRESS ||
                    dispatch.getDispatchStatus() == PENDING) {

                // Refund dispatch cost
                UtilRecords.DispatchScoreUpdateDto refundDto =
                        new UtilRecords.DispatchScoreUpdateDto(
                                dispatch.getDispatchRequester(),
                                dispatch.getDispatchId(),
                                dispatch.getDispatchCost()
                        );
                messagingService.updateUserScore(refundDto);
            }

            dispatch.setDispatchStatus(DispatchEnums.DispatchStatus.EXPIRED);
            UtilRecords.DispatchEndedDTO dispatchEndedDTO = new UtilRecords.DispatchEndedDTO(false,LocalDateTime.now(),dispatch.getDispatchVehicleId(),dispatch.getDispatchRequester(),dispatch.getVehicleName(),dispatch.getDispatchId());
            messagingService.sendDispatchCompletedFanoutFromDispatchService(dispatchEndedDTO);
          return  dispatchRepository.save(dispatch);
        }else {

            return dispatch;}}




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
        if (dispatch == null) {
            throw new IllegalArgumentException("Dispatch cannot be null");
        }

        if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.EXPIRED) {
            throw new ConflictException("Dispatch is expired");
        }

        if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.CANCELLED) {
            throw new ConflictException("Dispatch is cancelled");
        }

        if (dispatch.getDispatchStatus() == DispatchEnums.DispatchStatus.COMPLETED) {
            throw new ConflictException("Dispatch is completed");
        }

        if (dispatch.getDispatchEndTime() == null) {
            throw new ConflictException("Dispatch end time is not set");
        }


        LocalDateTime endTime = dispatch.getDispatchEndTime();
        LocalDateTime now = LocalDateTime.now();

        if (endTime.isBefore(now)) {
            throw new ConflictException("Dispatch has already ended");
        }

        return true;
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




}
