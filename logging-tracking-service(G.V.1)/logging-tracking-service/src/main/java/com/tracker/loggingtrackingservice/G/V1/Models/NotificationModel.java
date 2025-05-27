package com.tracker.loggingtrackingservice.G.V1.Models;


import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document
public class NotificationModel {
    @Id
    private String id;


    @NotNull(message = "Who are we sending the notification to")
    private String receiver;

    @NotNull(message = "The Notification must have a message")
    private String message;
    @NotNull(message = "The task must have a title")
    private Boolean read;

    @NotNull(message = "The task must have a description")
    private String description;

    @Enumerated(EnumType.STRING)
    private LogEnums.NotificationType type;

    @CreationTimestamp
    private LocalDateTime createdAt;


    private LocalDateTime readAt;

    public NotificationModel() {
    }

    public NotificationModel(String id, String receiver, String message, Boolean read, String description, LogEnums.NotificationType type, LocalDateTime createdAt, LocalDateTime readAt) {
        this.id = id;
        this.receiver = receiver;
        this.message = message;
        this.read = read;
        this.description = description;
        this.type = type;
        this.createdAt = createdAt;
        this.readAt = readAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
}
