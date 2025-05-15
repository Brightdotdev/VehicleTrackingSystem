package com.example.VehicleService.Models;

import com.example.VehicleService.Utils.VehicleEnums;
import jakarta.persistence.*;
import java.util.List;

/**
 * Represents a vehicle in the tracking system.
 */
@Entity
@Table(name = "vehicles")
public class VehicleModel {
    @Id
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName =  "user_id_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_id_sequence"
    )
    private Long id;

    @Column(nullable = false, unique = true)
    private String vehicleIdentificationNumber;

    // License plate number
    @Column(nullable = false, unique = true)
    private String licensePlate;

    @Column(nullable = false)
    private String model;


    @Column(nullable = false)
    private int vehicleAcquiredYear;

    // Engine type: GAS, DIESEL, ELECTRIC, HYBRID
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleEnums.EngineType engineType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleEnums.VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleEnums.VehicleStatus vehicleStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleEnums.VehicleDispatchStatus dispatchStatus;


    @ElementCollection
    private List<Long> dispatchHistory;

    @ElementCollection
    private List<String> vehicleImages;

    // Vehicle's safety score (out of 100)
    @Column(nullable = false)
    private Double safetyScore;

    @Column(nullable = false)
    private String vehicleMetadata;



    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VehicleHealthAttributeModel> healthAttributes;

    // Relationship to Vehicle Wildcards (if needed)
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VehicleWildcardAttributeModel> wildcardAttributes;


    public VehicleModel() {
    }

    public VehicleModel(Long id, String vehicleIdentificationNumber, String licensePlate, String model, int vehicleAcquiredYear, VehicleEnums.EngineType engineType, VehicleEnums.VehicleType vehicleType, VehicleEnums.VehicleStatus vehicleStatus, VehicleEnums.VehicleDispatchStatus dispatchStatus, List<Long> dispatchHistory, List<String> vehicleImages, Double safetyScore, String vehicleMetadata, List<VehicleHealthAttributeModel> healthAttributes,
                        List<VehicleWildcardAttributeModel> wildcardAttributes
    ) {
        this.id = id;
        this.vehicleIdentificationNumber = vehicleIdentificationNumber;
        this.licensePlate = licensePlate;
        this.model = model;
        this.vehicleAcquiredYear = vehicleAcquiredYear;
        this.engineType = engineType;
        this.vehicleType = vehicleType;
        this.vehicleStatus = vehicleStatus;
        this.dispatchStatus = dispatchStatus;
        this.dispatchHistory = dispatchHistory;
        this.vehicleImages = vehicleImages;
        this.safetyScore = safetyScore;
        this.vehicleMetadata = vehicleMetadata;
        this.healthAttributes = healthAttributes;
        this.wildcardAttributes = wildcardAttributes;
    }

    // Getters and setters for all fields
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVehicleIdentificationNumber() {
        return vehicleIdentificationNumber;
    }

    public void setVehicleIdentificationNumber(String vehicleIdentificationNumber) {
        this.vehicleIdentificationNumber = vehicleIdentificationNumber;
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

    public void addDispatchHistoryEntry(Long entry) {
        this.dispatchHistory.add(entry);
    }

    // Add multiple entries to dispatchHistory
    public void addDispatchHistoryEntries(List<Long> entries) {
        this.dispatchHistory.addAll(entries);
    }

    // Add a single vehicle image without overwriting the list
    public void addVehicleImage(String image) {
        this.vehicleImages.add(image);
    }

    // Add multiple vehicle images
    public void addVehicleImages(List<String> images) {
        this.vehicleImages.addAll(images);
    }

    public List<Long> getDispatchHistory() {
        return dispatchHistory;
    }

    public void setDispatchHistory(List<Long> dispatchHistory) {
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

    public List<VehicleHealthAttributeModel> getHealthAttributes() {
        return healthAttributes;
    }

    public void setHealthAttributes(List<VehicleHealthAttributeModel> healthAttributes) {
        this.healthAttributes = healthAttributes;
    }

    public List<VehicleWildcardAttributeModel> getWildcardAttributes() {
        return wildcardAttributes;
    }

    public void setWildcardAttributes(List<VehicleWildcardAttributeModel> wildcardAttributes) {
        this.wildcardAttributes = wildcardAttributes;
    }
}
