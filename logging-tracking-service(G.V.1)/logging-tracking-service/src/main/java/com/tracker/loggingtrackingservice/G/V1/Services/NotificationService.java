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

    private final NotificationSseService notificationEmiterService;

    public NotificationService(NotificationRepository notificationRepository, NotificationSseService notificationEmiterService) {
        this.notificationRepository = notificationRepository;
        this.notificationEmiterService = notificationEmiterService;
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
        notificationEmiterService.sendUserNotification(receiver, notificationModel);

    }

    public void handleValidatedDispatchNotif(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {
        NotificationModel notificationModel = new NotificationModel();

        String message = "Your request for the " + dispatchValidatedEvent.vehicleName() + " has been validated " + "we believe you plan to use the vehicle for " + dispatchValidatedEvent.dispatchReason() + "\n Enjoy your dispatch!";
        notificationModel.setCreatedAt(LocalDateTime.now());
        notificationModel.setDescription("Dispatch Request Notification");
        notificationModel.setRead(false);
        notificationModel.setReceiver(dispatchValidatedEvent.dispatchRequester());
        notificationModel.setType(LogEnums.NotificationType.INFO);
        notificationModel.setMessage(message);

        NotificationModel notificationModel1 = notificationRepository.save(notificationModel);
        System.out.println("Yes it worked here for the validated shii");
        System.out.println(notificationModel1);

        notificationEmiterService.sendUserNotification(dispatchValidatedEvent.dispatchRequester(), notificationModel1);

    }
}
