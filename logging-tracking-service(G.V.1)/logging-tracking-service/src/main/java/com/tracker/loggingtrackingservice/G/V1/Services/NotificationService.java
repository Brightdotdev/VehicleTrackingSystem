package com.tracker.loggingtrackingservice.G.V1.Services;

import com.tracker.loggingtrackingservice.G.V1.Models.NotificationModel;
import com.tracker.loggingtrackingservice.G.V1.RabbitMq.RabbitMqSenderService;
import com.tracker.loggingtrackingservice.G.V1.Repositories.NotificationRepository;
import com.tracker.loggingtrackingservice.G.V1.Repositories.TrackingRepository;
import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class NotificationService {


    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;

    }


    public void sendCreatedDispatchNotification(UtilRecords.dispatchRequestBody dispatchEvent) {

        NotificationModel notificationModel = new NotificationModel();

        String message = "Vehicle of VIN " + dispatchEvent.vehicleIdentificationNumber() + " is requested for dispatch from " + dispatchEvent.dispatchRequester() + " for " + dispatchEvent.dispatchReason() ;
        String receiver = dispatchEvent.dispatchRequester();

        notificationModel.setCreatedAt(LocalDateTime.now());
        notificationModel.setDescription("Dispatch Request Notification");
        notificationModel.setRead(false);
        notificationModel.setReceiver(receiver);
        notificationModel.setType(LogEnums.NotificationType.INFO);
        notificationModel.setMessage(message);

        NotificationModel notificationModel1 = notificationRepository.save(notificationModel);

        System.out.println("Yes it worked");
        System.out.println(notificationModel1);

    }
}
