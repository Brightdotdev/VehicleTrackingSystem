package com.tracker.loggingtrackingservice.G.V1.client;

import com.tracker.loggingtrackingservice.G.V1.dto.DispatchInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "dispatch-service")
public interface DispatchClient {
    @GetMapping("/dispatches/vehicle/{vehicleId}")
    DispatchInfo getDispatchByVehicleId(@PathVariable("vehicleId") Long vehicleId);
}
