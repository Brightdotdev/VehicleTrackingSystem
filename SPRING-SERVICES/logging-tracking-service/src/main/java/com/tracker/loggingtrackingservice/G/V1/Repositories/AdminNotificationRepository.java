package com.tracker.loggingtrackingservice.G.V1.Repositories;


import com.tracker.loggingtrackingservice.G.V1.Models.AdminNotificationModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminNotificationRepository  extends MongoRepository<AdminNotificationModel, String> {

    List<AdminNotificationModel> findByCreatedAtAfter(LocalDateTime createdAt);
}
