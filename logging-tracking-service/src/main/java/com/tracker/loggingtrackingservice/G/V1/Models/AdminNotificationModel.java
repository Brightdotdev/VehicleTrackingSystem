package com.tracker.loggingtrackingservice.G.V1.Models;

import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

public class AdminNotificationModel {

    @Id
    private String id;



    @NotNull(message = "Handled or not??")
    private boolean isHandled;

    private String handledBy;

    @NotNull(message = "The Notification must have a message")
    private String message;

    @NotNull(message = "Read or not read??")
    private Boolean read;

    @NotNull(message = "Is it an action notification or not???")
    private Boolean isActionNotif;

    private String goodNotificationCta;

    private String badNotificationCta;

    @NotNull(message = "The notification must have a title")
    private String title;

    @Enumerated(EnumType.STRING)
    private LogEnums.NotificationType type;

    @CreationTimestamp
    private LocalDateTime createdAt;


    private LocalDateTime readAt;

    private Long dispatchId;

    private String vehicleId;

    public AdminNotificationModel() {
    }

    public AdminNotificationModel(
            String id,
            Long dispatchId,
            String vehicleId,

            String handledBy, String message, Boolean read, String title,
            String goodNotificationCta, String badNotificationCta, Boolean isActionNotif,
            LogEnums.NotificationType type, LocalDateTime createdAt, LocalDateTime readAt) {
        this.id = id;
        this.handledBy = handledBy;
        this.message = message;
        this.dispatchId = dispatchId;
        this.vehicleId = vehicleId;
        this.read = read;
        this.title = title;
        this.type = type;
        this.createdAt = createdAt;
        this.readAt = readAt;
        this.badNotificationCta = badNotificationCta;
        this.goodNotificationCta = goodNotificationCta;
        this.isActionNotif = isActionNotif;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getHandledBy() {
        return handledBy;
    }

    public void setHandledBy(String handledBy) {
        this.handledBy = handledBy;
    }

    public boolean isHandled() {
        return isHandled;
    }

    public void setIsHandled(boolean isHandled) {
        this.isHandled = isHandled;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getRead() {
        return read;
    }

    public void setRead(Boolean read) {
        this.read = read;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LogEnums.NotificationType getType() {
        return type;
    }

    public void setType(LogEnums.NotificationType type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }


    public Boolean getActionNotif() {
        return isActionNotif;
    }

    public void setActionNotif(Boolean actionNotif) {
        isActionNotif = actionNotif;
    }

    public String getGoodNotificationCta() {
        return goodNotificationCta;
    }

    public void setGoodNotificationCta(String goodNotificationCta) {
        this.goodNotificationCta = goodNotificationCta;
    }

    public String getBadNotificationCta() {
        return badNotificationCta;
    }

    public void setBadNotificationCta(String badNotificationCta) {
        this.badNotificationCta = badNotificationCta;
    }

    public Long getDispatchId() {
        return dispatchId;
    }

    public void setDispatchId(Long dispatchId) {
        this.dispatchId = dispatchId;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

}


