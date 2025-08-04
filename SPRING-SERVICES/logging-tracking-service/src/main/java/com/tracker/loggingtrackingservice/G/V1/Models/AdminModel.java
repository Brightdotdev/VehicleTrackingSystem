package com.tracker.loggingtrackingservice.G.V1.Models;


import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document
public class AdminModel {

    @Id
    private String id;


    @NotNull(message = "Who is the amin As in email")
    private String email;

    @NotNull(message = "When was he created or her idc")
    private LocalDateTime joinedAt;

    @NotNull(message = "Is the email validated please")
    private Boolean isValidated;

    public AdminModel(String id, String email, LocalDateTime joinedAt, Boolean isValidated) {
        this.id = id;
        this.email = email;
        this.joinedAt = joinedAt;
        this.isValidated = isValidated;
    }

    public AdminModel() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail () {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public Boolean getValidated() {
        return isValidated;
    }

    public void setValidated(Boolean validated) {
        isValidated = validated;
    }
}
