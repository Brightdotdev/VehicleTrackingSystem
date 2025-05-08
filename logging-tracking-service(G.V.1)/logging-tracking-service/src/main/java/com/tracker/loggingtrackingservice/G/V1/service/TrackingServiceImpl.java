package com.tracker.loggingtrackingservice.G.V1.service;

import com.tracker.loggingtrackingservice.G.V1.client.DispatchClient;
import com.tracker.loggingtrackingservice.G.V1.client.VehicleClient;
import com.tracker.loggingtrackingservice.G.V1.dto.DispatchInfo;
import com.tracker.loggingtrackingservice.G.V1.dto.TrackingLogDTO;
import com.tracker.loggingtrackingservice.G.V1.dto.VehicleInfo;
import com.tracker.loggingtrackingservice.G.V1.entity.TrackingLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;

import java.util.List;

@FeignClient
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
    public List<TrackingLog> getLogsByDispatch(Long dispatchId) { return null; }
}
