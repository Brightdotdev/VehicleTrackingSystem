package com.tracker.loggingtrackingservice.G.V1.Models;


import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
public class TrackingModel {

    @Id
    private  String id;
    private String vehicleIdentificationNumber;
    private String dispatchRequester;
    private Long dispatchId;
    private String dispatchedBy;

    @Enumerated(EnumType.STRING)
    private LogEnums.DispatchReason dispatchReason;
    private List<UtilRecords.checkPoint> checkpoints;

    private UtilRecords.checkPoint currentLocation;


    @Enumerated(EnumType.STRING)
    private LogEnums.DispatchStatus dispatchStatus;
    private LocalDateTime dispatchEndTime;
    private LocalDateTime createdAt;

    private LocalDateTime endedAt;

    public TrackingModel() {
    }

    public TrackingModel(String id, String vehicleIdentificationNumber, String dispatchRequester, Long dispatchId, String dispatchedBy, LogEnums.DispatchReason dispatchReason, List<UtilRecords.checkPoint> checkpoints, UtilRecords.checkPoint currentLocation, LogEnums.DispatchStatus dispatchStatus, LocalDateTime dispatchEndTime, LocalDateTime createdAt, LocalDateTime endedAt) {
        this.id = id;
        this.vehicleIdentificationNumber = vehicleIdentificationNumber;
        this.dispatchRequester = dispatchRequester;
        this.dispatchId = dispatchId;
        this.dispatchedBy = dispatchedBy;
        this.dispatchReason = dispatchReason;
        this.checkpoints = checkpoints;
        this.currentLocation = currentLocation;
        this.dispatchStatus = dispatchStatus;
        this.dispatchEndTime = dispatchEndTime;
        this.createdAt = createdAt;
        this.endedAt = endedAt;
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

    public String getDispatchedBy() {
        return dispatchedBy;
    }

    public void setDispatchedBy(String dispatchedBy) {
        this.dispatchedBy = dispatchedBy;
    }

    public LogEnums.DispatchReason getDispatchReason() {
        return dispatchReason;
    }

    public void setDispatchReason(LogEnums.DispatchReason dispatchReason) {
        this.dispatchReason = dispatchReason;
    }

    public List<UtilRecords.checkPoint> getCheckpoints() {
        return checkpoints;
    }

    public void setCheckpoints(List<UtilRecords.checkPoint> checkpoints) {
        this.checkpoints = checkpoints;
    }

    public UtilRecords.checkPoint getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(UtilRecords.checkPoint currentLocation) {
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
}
