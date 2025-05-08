package com.tracker.loggingtrackingservice.G.V1.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long vehicleId;
    private Long dispatchId;
    private String vehicleName;
    private String vehicleHealth;
    private String dispatchStatus;
    private LocalDateTime dispatchExpiration;
    private String message;

    private LocalDateTime loggedAt;
}
