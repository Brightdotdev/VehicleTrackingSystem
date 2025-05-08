package com.tracker.loggingtrackingservice.G.V1.dto;

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
