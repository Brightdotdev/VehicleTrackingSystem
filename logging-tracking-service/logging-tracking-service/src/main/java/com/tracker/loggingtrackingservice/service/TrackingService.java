package com.tracker.loggingtrackingservice.service;

import com.tracker.loggingtrackingservice.dto.TrackingLogDTO;
import com.tracker.loggingtrackingservice.entity.TrackingLog;

import java.util.List;

public interface TrackingService {
    TrackingLogDTO startTracking(Long vehicleId);

    List<TrackingLog> getLogsByDispatch(Long dispatchId);
}
