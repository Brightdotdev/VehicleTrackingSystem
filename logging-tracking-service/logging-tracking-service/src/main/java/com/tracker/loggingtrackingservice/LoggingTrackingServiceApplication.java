package com.tracker.loggingtrackingservice;

import com.tracker.loggingtrackingservice.dto.DispatchInfo;
import com.tracker.loggingtrackingservice.dto.VehicleInfo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@SpringBootApplication
@EnableFeignClients
public class LoggingTrackingServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(LoggingTrackingServiceApplication.class, args);
		@FeignClient(name = "vehicle-service")
		interface VehicleClient {
			@GetMapping("/vehicles/{id}")
			VehicleInfo getVehicle(@PathVariable Long id);
		}

		@FeignClient(name = "dispatch-service")
		interface DispatchClient {
			@GetMapping("/dispatches/{id}")
			DispatchInfo getDispatch(@PathVariable Long id);
		}

	}
}

// Folder structure:
// com.tracker.loggingtrackingservice
// ├── client
// │   ├── VehicleClient.java
// │   └── DispatchClient.java
// ├── controller
// │   └── TrackingController.java
// ├── dto
// │   ├── DispatchInfo.java
// │   ├── VehicleInfo.java
// │   └── TrackingLogDTO.java
// ├── entity
// │   └── TrackingLog.java
// ├── repository
// │   └── TrackingLogRepository.java
// ├── service
// │   ├── TrackingService.java
// │   └── impl
// │       └── TrackingServiceImpl.java
// ├── security
// │   └── WebSecurityConfig.java
