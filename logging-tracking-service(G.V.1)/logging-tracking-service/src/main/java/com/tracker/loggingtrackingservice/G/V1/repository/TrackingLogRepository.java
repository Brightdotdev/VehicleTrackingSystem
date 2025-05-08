package com.tracker.loggingtrackingservice.G.V1.repository;


import com.tracker.loggingtrackingservice.G.V1.entity.TrackingLog;

import java.util.List;

public interface TrackingLogRepository {
    List<TrackingLog> findByDispatchId(Long dispatchId);
}
