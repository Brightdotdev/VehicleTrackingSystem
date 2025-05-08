package com.tracker.loggingtrackingservice.G.V1.controller;

import com.tracker.loggingtrackingservice.G.V1.dto.TrackingLogDTO;
import com.tracker.loggingtrackingservice.G.V1.entity.TrackingLog;
import com.tracker.loggingtrackingservice.G.V1.service.TrackingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final TrackingService trackingService;

    public <trackingService> TrackingController(trackingService trackingService) {
        this.trackingService = (com.tracker.loggingtrackingservice.G.V1.service.TrackingService) trackingService;
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
