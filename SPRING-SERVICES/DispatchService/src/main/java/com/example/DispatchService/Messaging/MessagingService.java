package com.example.DispatchService.Messaging;

import com.example.DispatchService.Utils.UtilRecords;

import java.util.Map;

public interface MessagingService {

    public  Map<String, Object> sendDispatchRequestedEvent(UtilRecords.dispatchRequestBodyDTO event);


    public  void updateUserScore(UtilRecords.DispatchScoreUpdateDto event);
    public  void checkDispatchEligibility(UtilRecords.IsValidForDispatchRequest event);


    public void sendDispatchCreatedEventNoResponse(UtilRecords.dispatchRequestBodyDTO event);

    public void sendDispatchCompletedFanoutFromDispatchService(UtilRecords.DispatchEndedDTO event);



    public void sendDispatchValidatedNoResponse(UtilRecords.ValidatedDispatch event);



}
