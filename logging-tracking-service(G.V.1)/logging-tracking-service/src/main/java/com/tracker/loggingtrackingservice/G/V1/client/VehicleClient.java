package com.tracker.loggingtrackingservice.G.V1.client;

import com.tracker.loggingtrackingservice.G.V1.dto.VehicleInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "vehicle-service")
@Service
public interface VehicleClient {
    @GetMapping("/vehicles/{id}")
    VehicleInfo getVehicle(@PathVariable("id") Long id);
}
