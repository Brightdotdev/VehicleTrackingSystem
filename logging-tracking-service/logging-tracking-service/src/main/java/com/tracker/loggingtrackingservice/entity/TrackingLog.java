package com.tracker.loggingtrackingservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;
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
