package com.tracker.loggingtrackingservice.controller;

import com.tracker.loggingtrackingservice.dto.TrackingLogDTO;
import com.tracker.loggingtrackingservice.entity.TrackingLog;
import com.tracker.loggingtrackingservice.service.TrackingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @PostMapping("/start/{vehicleId}")
    public TrackingLogDTO startTracking(@PathVariable Long vehicleId) {
        return trackingService.startTracking(vehicleId);
    }

    @GetMapping("/logs/{dispatchId}")
    public List<TrackingLog> getLogs(@PathVariable Long dispatchId) {
        return trackingService.getLogsByDispatch(dispatchId);
    }
}
