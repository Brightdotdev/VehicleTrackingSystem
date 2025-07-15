package com.tracker.loggingtrackingservice.G.V1.Messaging;

import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;

public interface MessagingService  {

    public void sendCompletedDispatchFanOut(UtilRecords.DispatchEndedDTO event);
    public void sendTrackingInitializationFanout(UtilRecords.StartTrackingDTO event);
    public void sendTrackingCheckPointFanOut(UtilRecords.vehicleLocationUpdate event);
}
