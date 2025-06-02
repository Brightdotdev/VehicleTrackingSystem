package com.tracker.loggingtrackingservice.G.V1.Repositories;

import com.tracker.loggingtrackingservice.G.V1.Models.NotificationModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<NotificationModel, String> {

     List<NotificationModel> findByReceiver(String receiver);


}
