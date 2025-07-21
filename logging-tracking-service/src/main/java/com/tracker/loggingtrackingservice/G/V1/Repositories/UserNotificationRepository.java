package com.tracker.loggingtrackingservice.G.V1.Repositories;

import com.tracker.loggingtrackingservice.G.V1.Models.UserNotificationModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface UserNotificationRepository extends MongoRepository<UserNotificationModel, String> {

     List<UserNotificationModel> findAllByReceiver(String receiver);


     UserNotificationModel findByDispatchIdAndVehicleId(Long dispatchId , String vehicleId);
     List<UserNotificationModel> findByReceiverAndCreatedAtAfter(String receiver, LocalDateTime since);


}
