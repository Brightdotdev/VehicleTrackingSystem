package com.tracker.loggingtrackingservice.G.V1.Repositories;

import com.tracker.loggingtrackingservice.G.V1.Models.NotificationModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends MongoRepository<NotificationModel, String> {

     List<NotificationModel> findAllByReceiver(String receiver);


     NotificationModel findByDispatchIdAndVehicleId(Long dispatchId ,  String vehicleId);
     List<NotificationModel> findByReceiverAndCreatedAtAfter(String receiver, LocalDateTime since);


}
