package com.tracker.loggingtrackingservice.dto;

import lombok.Data;

@Data
public class VehicleInfo {
    private String name;

    public String getName() {
        return name;
    }
}
