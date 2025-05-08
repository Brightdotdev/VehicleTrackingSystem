package com.tracker.loggingtrackingservice.G.V1.service;

import com.tracker.loggingtrackingservice.G.V1.dto.TrackingLogDTO;
import com.tracker.loggingtrackingservice.G.V1.entity.TrackingLog;

import java.util.List;

public interface TrackingService {
    TrackingLogDTO startTracking(Long vehicleId);

    List<TrackingLog> getLogsByDispatch(Long dispatchId);
}
