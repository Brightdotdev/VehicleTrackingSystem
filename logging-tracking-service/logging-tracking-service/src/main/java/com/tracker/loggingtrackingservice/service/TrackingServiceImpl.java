package com.tracker.loggingtrackingservice.service;

import com.tracker.loggingtrackingservice.client.DispatchClient;
import com.tracker.loggingtrackingservice.client.VehicleClient;
import com.tracker.loggingtrackingservice.dto.DispatchInfo;
import com.tracker.loggingtrackingservice.dto.VehicleInfo;
import com.tracker.loggingtrackingservice.dto.TrackingLogDTO;
import com.tracker.loggingtrackingservice.entity.TrackingLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
public class TrackingServiceImpl implements TrackingService {

    private final VehicleClient vehicleClient;
    private final DispatchClient dispatchClient;
    @Autowired
    public TrackingServiceImpl(VehicleClient vehicleClient, DispatchClient dispatchClient) {
        this.vehicleClient = vehicleClient;
        this.dispatchClient = dispatchClient;
    }
    @Override
    public TrackingLogDTO startTracking(Long vehicleId) {
        VehicleInfo vehicle = vehicleClient.getVehicle(vehicleId);
        DispatchInfo dispatch = dispatchClient.getDispatchByVehicleId(vehicleId);

        TrackingLogDTO log = new TrackingLogDTO();
        log.setVehicle(vehicle);
        log.setDispatch(dispatch);
        log.setMessage("Tracking started for vehicle" + vehicle.getName());
        return log;
    }

    @Override
    public List<TrackingLog> getLogsByDispatch(Long dispatchId) {
        return null;
    }
}
