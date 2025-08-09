package com.tracker.loggingtrackingservice.G.V1.Repositories;

import com.tracker.loggingtrackingservice.G.V1.Models.UserNotificationModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserNotificationRepository extends MongoRepository<UserNotificationModel, String> {

     List<UserNotificationModel> findAllByReceiver(String receiver);

     UserNotificationModel findByReceiver(String receiver);


     List<UserNotificationModel> findByReceiverAndCreatedAtAfter(String receiver, LocalDateTime since);
     Optional<UserNotificationModel> findFirstByDispatchIdAndVehicleId(Long dispatchId, String vehicleId);


}
