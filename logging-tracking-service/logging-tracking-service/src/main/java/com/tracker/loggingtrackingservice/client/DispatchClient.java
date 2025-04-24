package com.tracker.loggingtrackingservice.client;

import com.tracker.loggingtrackingservice.dto.DispatchInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "dispatch-service")
public interface DispatchClient {
    @GetMapping("/dispatches/vehicle/{vehicleId}")
    DispatchInfo getDispatchByVehicleId(@PathVariable("vehicleId") Long vehicleId);
}
