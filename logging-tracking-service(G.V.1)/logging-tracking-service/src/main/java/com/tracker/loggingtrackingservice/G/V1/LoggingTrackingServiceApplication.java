package com.tracker.loggingtrackingservice.G.V1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class LoggingTrackingServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(LoggingTrackingServiceApplication.class, args);

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
