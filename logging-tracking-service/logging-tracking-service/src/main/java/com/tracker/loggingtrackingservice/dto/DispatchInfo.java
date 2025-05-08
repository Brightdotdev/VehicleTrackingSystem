package com.tracker.loggingtrackingservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DispatchInfo {
    private Long id;
    private String status;
    private String name;
    private LocalDateTime expiration;
    private String destination;
    private Long vehicleId;
}
