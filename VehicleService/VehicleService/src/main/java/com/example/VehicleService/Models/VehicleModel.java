package com.example.VehicleService.Models;


import com.example.VehicleService.Utils.VehicleEnums;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a vehicle in the tracking system.
 */
@Entity
@Table(name = "vehicles")
public class VehicleModel {

    // Unique ID for the vehicle in the database
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @Column(nullable = false, unique = true)
    private String VehicleIdentificationNumber;

    // License plate number
    @Column(nullable = false, unique = true)
    private String licensePlate;

    @Column(nullable = false)
    private String model;

    private int vehicleAcquiredYear;


    // Engine type: GAS, DIESEL, ELECTRIC, HYBRID
    @Enumerated(EnumType.STRING)
    private VehicleEnums.EngineType engineType;

    @Enumerated(EnumType.STRING)
    private VehicleEnums.VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    private VehicleEnums.VehicleStatus vehicleStatus;

    @Enumerated(EnumType.STRING)
    private VehicleEnums.VehicleDispatchStatus dispatchStatus;

    @Enumerated(EnumType.STRING)
    private VehicleEnums.VehicleHealthStatus healthStatus;

    @ElementCollection
    private List<String> dispatchHistory;


    @ElementCollection
    private List<String> vehicleImages;


    // Vehicle's safety score (out of 100)
    private Double safetyScore;

    private String vehicleMetadata;


    public VehicleModel() {
    }

    public VehicleModel(int id, String vehicleIdentificationNumber, String licensePlate, String model, int vehicleAcquiredYear, VehicleEnums.EngineType engineType, VehicleEnums.VehicleType vehicleType, VehicleEnums.VehicleStatus vehicleStatus, VehicleEnums.VehicleDispatchStatus dispatchStatus, VehicleEnums.VehicleHealthStatus healthStatus, List<String> dispatchHistory, List<String> vehicleImages, Double safetyScore, String vehicleMetadata) {
        this.id = id;
        VehicleIdentificationNumber = vehicleIdentificationNumber;
        this.licensePlate = licensePlate;
        this.model = model;
        this.vehicleAcquiredYear = vehicleAcquiredYear;
        this.engineType = engineType;
        this.vehicleType = vehicleType;
        this.vehicleStatus = vehicleStatus;
        this.dispatchStatus = dispatchStatus;
        this.healthStatus = healthStatus;
        this.dispatchHistory = dispatchHistory;
        this.vehicleImages = vehicleImages;
        this.safetyScore = safetyScore;
        this.vehicleMetadata = vehicleMetadata;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getVehicleIdentificationNumber() {
        return VehicleIdentificationNumber;
    }

    public void setVehicleIdentificationNumber(String vehicleIdentificationNumber) {
        VehicleIdentificationNumber = vehicleIdentificationNumber;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getVehicleAcquiredYear() {
        return vehicleAcquiredYear;
    }

    public void setVehicleAcquiredYear(int vehicleAcquiredYear) {
        this.vehicleAcquiredYear = vehicleAcquiredYear;
    }

    public VehicleEnums.EngineType getEngineType() {
        return engineType;
    }

    public void setEngineType(VehicleEnums.EngineType engineType) {
        this.engineType = engineType;
    }

    public VehicleEnums.VehicleType getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(VehicleEnums.VehicleType vehicleType) {
        this.vehicleType = vehicleType;
    }

    public VehicleEnums.VehicleStatus getVehicleStatus() {
        return vehicleStatus;
    }

    public void setVehicleStatus(VehicleEnums.VehicleStatus vehicleStatus) {
        this.vehicleStatus = vehicleStatus;
    }

    public VehicleEnums.VehicleDispatchStatus getDispatchStatus() {
        return dispatchStatus;
    }

    public void setDispatchStatus(VehicleEnums.VehicleDispatchStatus dispatchStatus) {
        this.dispatchStatus = dispatchStatus;
    }

    public VehicleEnums.VehicleHealthStatus getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(VehicleEnums.VehicleHealthStatus healthStatus) {
        this.healthStatus = healthStatus;
    }

    public List<String> getDispatchHistory() {
        return dispatchHistory;
    }

    public void setDispatchHistory(List<String> dispatchHistory) {
        this.dispatchHistory = dispatchHistory;
    }

    public List<String> getVehicleImages() {
        return vehicleImages;
    }

    public void setVehicleImages(List<String> vehicleImages) {
        this.vehicleImages = vehicleImages;
    }

    public Double getSafetyScore() {
        return safetyScore;
    }

    public void setSafetyScore(Double safetyScore) {
        this.safetyScore = safetyScore;
    }

    public String getVehicleMetadata() {
        return vehicleMetadata;
    }

    public void setVehicleMetadata(String vehicleMetadata) {
        this.vehicleMetadata = vehicleMetadata;
    }
}
