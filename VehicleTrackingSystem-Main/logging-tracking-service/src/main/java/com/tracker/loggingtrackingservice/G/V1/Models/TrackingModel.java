package com.tracker.loggingtrackingservice.G.V1.Models;


import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document
public class TrackingModel {

    @Id
    private  String id;
    private String vehicleIdentificationNumber;
    private String dispatchRequester;


    @Column(unique = true)
    private Long dispatchId;

    private String dispatchAdmin;

    @Enumerated(EnumType.STRING)
    private LogEnums.DispatchReason dispatchReason;
    private List<UtilRecords.CheckPoint> checkpoints;

    private UtilRecords.CheckPoint currentLocation;


    @Enumerated(EnumType.STRING)
    private LogEnums.DispatchStatus dispatchStatus;
    private LocalDateTime dispatchEndTime;
    private LocalDateTime createdAt;

    private LocalDateTime endedAt;

    private String vehicleName;


    public void addToCheckPoint(UtilRecords.CheckPoint checkpoint) {
            checkpoints.add(checkpoint);}

    public TrackingModel() {
    }

    public TrackingModel(String id, String vehicleIdentificationNumber, String dispatchRequester, Long dispatchId, String dispatchAdmin, LogEnums.DispatchReason dispatchReason, List<UtilRecords.CheckPoint> checkpoints, UtilRecords.CheckPoint currentLocation, LogEnums.DispatchStatus dispatchStatus, LocalDateTime dispatchEndTime, LocalDateTime createdAt, LocalDateTime endedAt, String vehicleName) {
        this.id = id;
        this.vehicleIdentificationNumber = vehicleIdentificationNumber;
        this.dispatchRequester = dispatchRequester;
        this.dispatchId = dispatchId;
        this.dispatchAdmin = dispatchAdmin;
        this.dispatchReason = dispatchReason;
        this.checkpoints = checkpoints;
        this.currentLocation = currentLocation;
        this.dispatchStatus = dispatchStatus;
        this.dispatchEndTime = dispatchEndTime;
        this.createdAt = createdAt;
        this.endedAt = endedAt;
        this.vehicleName = vehicleName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVehicleIdentificationNumber() {
        return vehicleIdentificationNumber;
    }

    public void setVehicleIdentificationNumber(String vehicleIdentificationNumber) {
        this.vehicleIdentificationNumber = vehicleIdentificationNumber;
    }

    public String getDispatchRequester() {
        return dispatchRequester;
    }

    public void setDispatchRequester(String dispatchRequester) {
        this.dispatchRequester = dispatchRequester;
    }

    public Long getDispatchId() {
        return dispatchId;
    }

    public void setDispatchId(Long dispatchId) {
        this.dispatchId = dispatchId;
    }

    public String getDispatchAdmin() {
        return dispatchAdmin;
    }

    public void setDispatchAdmin(String dispatchAdmin) {
        this.dispatchAdmin = dispatchAdmin;
    }

    public LogEnums.DispatchReason getDispatchReason() {
        return dispatchReason;
    }

    public void setDispatchReason(LogEnums.DispatchReason dispatchReason) {
        this.dispatchReason = dispatchReason;
    }

    public List<UtilRecords.CheckPoint> getCheckpoints() {
        return checkpoints;
    }

    public void setCheckpoints(List<UtilRecords.CheckPoint> checkpoints) {
        this.checkpoints = checkpoints;
    }

    public UtilRecords.CheckPoint getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(UtilRecords.CheckPoint currentLocation) {
        this.currentLocation = currentLocation;
    }

    public LogEnums.DispatchStatus getDispatchStatus() {
        return dispatchStatus;
    }

    public void setDispatchStatus(LogEnums.DispatchStatus dispatchStatus) {
        this.dispatchStatus = dispatchStatus;
    }

    public LocalDateTime getDispatchEndTime() {
        return dispatchEndTime;
    }

    public void setDispatchEndTime(LocalDateTime dispatchEndTime) {
        this.dispatchEndTime = dispatchEndTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
    }

    public String getVehicleName() {
        return vehicleName;
    }

    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }
}
