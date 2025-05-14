package com.example.DispatchService.Models;

import com.example.DispatchService.Utils.DispatchEnums;
import com.example.DispatchService.Utils.MapToJsonConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;;




@Entity
@Table(name = "dispatchModel")
public class DispatchModel {

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
    private Long dispatchId;


    @NotNull(message = "Uhm who tf is making the dispatch")
    private String dispatchRequester;

    private String dispatchAdmin;

    @NotNull(message = "Uhm what are we dispatching")
    private String dispatchVehicleId;


    @NotNull(message = "What role of dispatch request if this coming from")
    private List<String> dispatchRequesterRole;

    @NotNull(message = "Uhm what type of vehicle is being dispatched")
    @Enumerated(EnumType.STRING)
    private DispatchEnums.VehicleStatus vehicleClass;


    // dispatch logs and metadata

    private LocalDateTime dispatchRequestTime;

    private LocalDateTime dispatchRequestApproveTime;

    private LocalDateTime dispatchStartTime;

    private LocalDateTime dispatchEndTime;

    @NotNull(message = "Reason for dispatch is required")
    @Enumerated(EnumType.STRING)
    private DispatchEnums.DispatchReason dispatchReason;


    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    private DispatchEnums.DispatchStatus dispatchStatus;


    @Convert(converter = MapToJsonConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, Object> dispatchMetadata;


    private Double dispatchReviewScore;

    public DispatchModel() {
    }

    public DispatchModel(Long dispatchId, String dispatchRequester, String dispatchAdmin, String dispatchVehicleId, List<String> dispatchRequesterRole, DispatchEnums.VehicleStatus vehicleClass, LocalDateTime dispatchRequestTime, LocalDateTime dispatchRequestApproveTime, LocalDateTime dispatchStartTime, LocalDateTime dispatchEndTime, DispatchEnums.DispatchReason dispatchReason, DispatchEnums.DispatchStatus dispatchStatus, Map<String, Object> dispatchMetadata, Double dispatchReviewScore) {
        this.dispatchId = dispatchId;
        this.dispatchRequester = dispatchRequester;
        this.dispatchAdmin = dispatchAdmin;
        this.dispatchVehicleId = dispatchVehicleId;
        this.dispatchRequesterRole = dispatchRequesterRole;
        this.vehicleClass = vehicleClass;
        this.dispatchRequestTime = dispatchRequestTime;
        this.dispatchRequestApproveTime = dispatchRequestApproveTime;
        this.dispatchStartTime = dispatchStartTime;
        this.dispatchEndTime = dispatchEndTime;
        this.dispatchReason = dispatchReason;
        this.dispatchStatus = dispatchStatus;
        this.dispatchMetadata = dispatchMetadata;
        this.dispatchReviewScore = dispatchReviewScore;
    }
    public void addToDispatchMetadata(String key, Object value) {
        if (this.dispatchMetadata == null) {
            this.dispatchMetadata = new HashMap<>();
        }
        this.dispatchMetadata.put(key, value);
    }
    public Long getDispatchId() {
        return dispatchId;
    }

    public void setDispatchId(Long dispatchId) {
        this.dispatchId = dispatchId;
    }

    public String getDispatchRequester() {
        return dispatchRequester;
    }

    public void setDispatchRequester(String dispatchRequester) {
        this.dispatchRequester = dispatchRequester;
    }

    public String getDispatchAdmin() {
        return dispatchAdmin;
    }

    public void setDispatchAdmin(String dispatchAdmin) {
        this.dispatchAdmin = dispatchAdmin;
    }

    public String getDispatchVehicleId() {
        return dispatchVehicleId;
    }

    public void setDispatchVehicleId(String dispatchVehicleId) {
        this.dispatchVehicleId = dispatchVehicleId;
    }

    public List<String> getDispatchRequesterRole() {
        return dispatchRequesterRole;
    }

    public void setDispatchRequesterRole(List<String> dispatchRequesterRole) {
        this.dispatchRequesterRole = dispatchRequesterRole;
    }

    public DispatchEnums.VehicleStatus getVehicleClass() {
        return vehicleClass;
    }

    public void setVehicleClass(DispatchEnums.VehicleStatus vehicleClass) {
        this.vehicleClass = vehicleClass;
    }

    public LocalDateTime getDispatchRequestTime() {
        return dispatchRequestTime;
    }

    public void setDispatchRequestTime(LocalDateTime dispatchRequestTime) {
        this.dispatchRequestTime = dispatchRequestTime;
    }

    public LocalDateTime getDispatchRequestApproveTime() {
        return dispatchRequestApproveTime;
    }

    public void setDispatchRequestApproveTime(LocalDateTime dispatchRequestApproveTime) {
        this.dispatchRequestApproveTime = dispatchRequestApproveTime;
    }

    public LocalDateTime getDispatchStartTime() {
        return dispatchStartTime;
    }

    public void setDispatchStartTime(LocalDateTime dispatchStartTime) {
        this.dispatchStartTime = dispatchStartTime;
    }

    public LocalDateTime getDispatchEndTime() {
        return dispatchEndTime;
    }

    public void setDispatchEndTime(LocalDateTime dispatchEndTime) {
        this.dispatchEndTime = dispatchEndTime;
    }

    public DispatchEnums.DispatchReason getDispatchReason() {
        return dispatchReason;
    }

    public void setDispatchReason(DispatchEnums.DispatchReason dispatchReason) {
        this.dispatchReason = dispatchReason;
    }

    public DispatchEnums.DispatchStatus getDispatchStatus() {
        return dispatchStatus;
    }

    public void setDispatchStatus(DispatchEnums.DispatchStatus dispatchStatus) {
        this.dispatchStatus = dispatchStatus;
    }

    public Map<String, Object> getDispatchMetadata() {
        return dispatchMetadata;
    }

    public void setDispatchMetadata(Map<String, Object> dispatchMetadata) {
        this.dispatchMetadata = dispatchMetadata;
    }

    public Double getDispatchReviewScore() {
        return dispatchReviewScore;
    }

    public void setDispatchReviewScore(Double dispatchReviewScore) {
        this.dispatchReviewScore = dispatchReviewScore;
    }
}