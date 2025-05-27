    package com.tracker.loggingtrackingservice.G.V1.Services;

    import com.tracker.loggingtrackingservice.G.V1.Config.UserHandler;
    import com.tracker.loggingtrackingservice.G.V1.Exceptions.InvalidTaskRequestException;
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
        private final TrackingService trackingService;
        private final NotificationSseService notificationEmiterService;

        public NotificationService(NotificationRepository notificationRepository, TrackingService trackingService, NotificationSseService notificationEmiterService) {
            this.notificationRepository = notificationRepository;
            this.trackingService = trackingService;
            this.notificationEmiterService = notificationEmiterService;
        }


        public void sendCreatedDispatchNotification(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {

            String receiver = dispatchEvent.dispatchRequester();

            if (receiver == null) {
                throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
            }

            String message = "Vehicle of VIN " + dispatchEvent.vehicleIdentificationNumber()
                    + " is requested for dispatch from " + receiver
                    + " for " + dispatchEvent.dispatchReason();
            System.out.println(message);


            NotificationModel notificationModel = new NotificationModel();

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

            String message = "Your request for the " + dispatchValidatedEvent.vehicleName()
                    + " has been validated. We believe you plan to use the vehicle for "
                    + dispatchValidatedEvent.dispatchReason() + ".\nEnjoy your dispatch!";
            System.out.println(message);

            if (receiver == null) {
                System.err.println("❌ Validated dispatch requester is null, cannot send notification.");
                return;
            }

            NotificationModel notificationModel = new NotificationModel();

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

            notificationEmiterService.sendUserDispatchNotification(receiver, savedNotification);

        }

        public void completedDispatchNotification(UtilRecords.DispatchEndedDTO dispatchEvent) {
            String receiver = dispatchEvent.receiver();
            Boolean wasCancelled = dispatchEvent.wasCancelled();
            String message;
            if(wasCancelled){
                 message = "Hello your dispatch fo the" + dispatchEvent.vehicleName()
                        + " has been cancelled....thank you for your using Auto Port";
            }

            message = "Hello your dispatch fo the" + dispatchEvent.vehicleName()
                    + " is completed and has been expired....thank you for your using Auto Port";

            System.out.println(message);

            NotificationModel notificationModel = new NotificationModel();

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
            trackingService.stopTracking(dispatchEvent);
        }
    }
