package com.tracker.loggingtrackingservice.G.V1.Messaging;

import com.tracker.loggingtrackingservice.G.V1.Utils.ApiResponse;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

public interface MessagingService  {

    public void sendCompletedDispatchFanOut(UtilRecords.DispatchEndedDTO event);
    public void sendTrackingInitializationFanout(UtilRecords.StartTrackingDTO event);
    public void sendTrackingCheckPointFanOut(UtilRecords.vehicleLocationUpdate event);

}
