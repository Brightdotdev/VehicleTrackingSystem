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

        String receiver = dispatchEvent.dispatchRequester();
        if (receiver == null) {
            System.err.println("❌ Dispatch requester is null, cannot send notification.");
            return;
        }

        NotificationModel notificationModel = new NotificationModel();

        String message = "Vehicle of VIN " + dispatchEvent.vehicleIdentificationNumber()
                + " is requested for dispatch from " + receiver
                + " for " + dispatchEvent.dispatchReason();

        // Set up the notification model
        notificationModel.setCreatedAt(LocalDateTime.now());
        notificationModel.setDescription("Dispatch Request Notification");
        notificationModel.setRead(false);
        notificationModel.setReceiver(receiver);
        notificationModel.setType(LogEnums.NotificationType.INFO);
        notificationModel.setMessage(message);

        // Save and send notification
        NotificationModel savedNotification = notificationRepository.save(notificationModel);

        System.out.println("✅ Dispatch creation notification saved.");
        System.out.println(savedNotification);

        notificationEmiterService.sendUserNotification(receiver, savedNotification);

    }

    public void handleValidatedDispatchNotif(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {
        String receiver = dispatchValidatedEvent.dispatchRequester();
        if (receiver == null) {
            System.err.println("❌ Validated dispatch requester is null, cannot send notification.");
            return;
        }

        NotificationModel notificationModel = new NotificationModel();

        String message = "Your request for the " + dispatchValidatedEvent.vehicleName()
                + " has been validated. We believe you plan to use the vehicle for "
                + dispatchValidatedEvent.dispatchReason() + ".\nEnjoy your dispatch!";

        // Set up the notification model
        notificationModel.setCreatedAt(LocalDateTime.now());
        notificationModel.setDescription("Dispatch Request Notification");
        notificationModel.setRead(false);
        notificationModel.setReceiver(receiver);
        notificationModel.setType(LogEnums.NotificationType.INFO);
        notificationModel.setMessage(message);

        // Save and send notification
        NotificationModel savedNotification = notificationRepository.save(notificationModel);

        System.out.println("✅ Validated dispatch notification saved.");
        System.out.println(savedNotification);

        notificationEmiterService.sendUserNotification(receiver, savedNotification);

    }
}
