package com.tracker.loggingtrackingservice.repository;

import com.tracker.loggingtrackingservice.entity.TrackingLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingLogRepository extends JpaRepository<TrackingLog, Long> {
    List<TrackingLog> findByDispatchId(Long dispatchId);
}
