    package com.tracker.loggingtrackingservice.G.V1.Services;

    import com.tracker.loggingtrackingservice.G.V1.Config.UserHandler;
    import com.tracker.loggingtrackingservice.G.V1.Exceptions.AccessException;
    import com.tracker.loggingtrackingservice.G.V1.Exceptions.InvalidTaskRequestException;
    import com.tracker.loggingtrackingservice.G.V1.Exceptions.NotFoundException;
    import com.tracker.loggingtrackingservice.G.V1.Models.NotificationModel;
    import com.tracker.loggingtrackingservice.G.V1.Repositories.NotificationRepository;
    import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
    import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
    import jakarta.transaction.Transactional;
    import jakarta.validation.Valid;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.util.*;


    @Service
    public class NotificationService {



        private final NotificationRepository notificationRepository;
        private final UserHandler userHandler;
        private final TrackingService trackingService;
        private final NotificationSseService notificationEmitterService;

        public NotificationService(NotificationRepository notificationRepository, UserHandler userHandler, TrackingService trackingService, NotificationSseService notificationEmitterService) {
            this.notificationRepository = notificationRepository;
            this.userHandler = userHandler;
            this.trackingService = trackingService;
            this.notificationEmitterService = notificationEmitterService;
        }

        public void sendCreatedDispatchNotification(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {

            String receiver = dispatchEvent.dispatchRequester();
            if (receiver == null) {
                throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
            }

            String message = "Hello your request for dispatch "+ dispatchEvent.vehicleName() +  " is being processed is accepted and is being processed we believe you want to use the vehicle for " + dispatchEvent.dispatchReason() + " till " + dispatchEvent.dispatchEndTime();

            NotificationModel notificationModel = new NotificationModel();

            // Set up the notification model
            notificationModel.setCreatedAt(LocalDateTime.now());
            notificationModel.setTitle("Dispatch Request");
            notificationModel.setRead(false);
            notificationModel.setReceiver(receiver);
            notificationModel.setType(LogEnums.NotificationType.INFO);
            notificationModel.setMessage(message);


            // Save and send notification
            NotificationModel savedNotification = notificationRepository.save(notificationModel);

            System.out.println("✅ Dispatch creation notification saved.");


            UtilRecords.NotificationDto dispatchCreatedNotif = new UtilRecords.NotificationDto(message, savedNotification.getTitle(),savedNotification.getId(),false,null,null,receiver,false);
            System.out.println(savedNotification);

            notificationEmitterService.sendUserNotification(receiver, dispatchCreatedNotif);
        }


        public void sendCreatedDispatchNotificationsForAdmin(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {

            String receiver = dispatchEvent.dispatchRequester();

            if (receiver == null) {
                throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
            }

            String message = "Vehicle of VIN " + dispatchEvent.vehicleIdentificationNumber()
                    + " is requested for dispatch from " + receiver
                    + " for " + dispatchEvent.dispatchReason() + " till " + dispatchEvent.dispatchEndTime();
            System.out.println(message);

            NotificationModel notificationModel = new NotificationModel();

            // Set up the notification model
            notificationModel.setCreatedAt(LocalDateTime.now());
            notificationModel.setTitle("Dispatch Request Notification");
            notificationModel.setRead(false);
            notificationModel.setReceiver(receiver);
            notificationModel.setType(LogEnums.NotificationType.INFO);
            notificationModel.setMessage(message);

            // Save and send notification
            NotificationModel savedNotification = notificationRepository.save(notificationModel);


            UtilRecords.NotificationDto dispatchCreatedNotif = new UtilRecords.NotificationDto(message, savedNotification.getTitle()
                    ,savedNotification.getId(),false,null,null,receiver,false);
            System.out.println(savedNotification);



            System.out.println("✅ Dispatch creation notification saved.");
            System.out.println(savedNotification);
            notificationEmitterService.sendAdminsNotification(dispatchCreatedNotif);
        }


        // an admin validates a notification do this
        public void handleValidatedDispatchNotif(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {
            String receiver = dispatchValidatedEvent.dispatchRequester();

            if (receiver == null) {
                System.err.println("❌ Validated dispatch requester is null, cannot send notification.");
                return;
            }
            String message = "Your request for the " + dispatchValidatedEvent.vehicleName()
                    + " has been validated. We believe you plan to use the vehicle for "
                    + dispatchValidatedEvent.dispatchReason() + ".\nEnjoy your dispatch!(or wtv)";
            System.out.println(message);

            NotificationModel notificationModel = new NotificationModel();


            // Set up the notification model
            notificationModel.setCreatedAt(LocalDateTime.now());
            notificationModel.setTitle(receiver +  "'s Dispatch Validated");
            notificationModel.setRead(false);
            notificationModel.setReceiver(receiver);
            notificationModel.setType(LogEnums.NotificationType.INFO);
            notificationModel.setMessage(message);

            // Save and send notification
            NotificationModel savedNotification = notificationRepository.save(notificationModel);

           Map<String, Object> goodCta = new HashMap<>();
           Map<String, Object> badCta = new HashMap<>();
           goodCta.put("Start Tracking", dispatchValidatedEvent.dispatchId());
           badCta.put("Cancel Dispatch", dispatchValidatedEvent.dispatchId());


            UtilRecords.NotificationDto validatedFroTrackingDto = new UtilRecords.NotificationDto(message, savedNotification.getTitle(),savedNotification.getId(),true,badCta,goodCta,receiver,false);


            System.out.println("✅ Validated dispatch notification saved.");
            System.out.println(savedNotification);

            notificationEmitterService.sendUserDispatchNotification(receiver, validatedFroTrackingDto);

        }

        // if a dispatch is completed do this
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
            notificationModel.setTitle("Dispatch Request ");
            notificationModel.setRead(false);
            notificationModel.setReceiver(receiver);
            notificationModel.setType(LogEnums.NotificationType.INFO);
            notificationModel.setMessage(message);

            // Save and send notification
            NotificationModel savedNotification = notificationRepository.save(notificationModel);


            UtilRecords.NotificationDto dispatchCompletedNotif = new UtilRecords.NotificationDto(message, savedNotification.getTitle()
                    ,savedNotification.getId(),false,null,null,receiver,false);
            System.out.println(savedNotification);

            System.out.println("✅ Validated dispatch notification saved.");
            System.out.println(savedNotification);

            notificationEmitterService.sendUserNotification(receiver, dispatchCompletedNotif);
            trackingService.stopTracking(dispatchEvent);
        }



        // set notifications to read
        @Transactional
        public List<UtilRecords.NotificationDto>
        setNotificationToRead(List<UtilRecords.setReadRecord> notificationToRead,
                              String notifReader) {

            String user = userHandler.getCurrentUser();
            List<UtilRecords.NotificationDto> finalNotifications = new ArrayList<>();

            if (!user.equals(notifReader)){
                System.out.println("How is this happening  tho");
                System.out.println(" Notif reader "   + notifReader);
                System.out.println(" User from user handler "   + user);
            throw new AccessException("Contradicting user and notifications to be sent to");
            }

            for (UtilRecords.setReadRecord notification : notificationToRead){

                Optional<NotificationModel> foundNotification = notificationRepository.findById(notification.notifId());

                System.out.println ( "outside the i statement" + foundNotification);

                if(foundNotification.isEmpty()){
                    System.out.println(foundNotification);
                   throw new NotFoundException("Notification not found...someone tampered with the code");}

                NotificationModel notificationToBeSaved = foundNotification.get();

                notificationToBeSaved.setRead(true);
                notificationToBeSaved.setReadAt(LocalDateTime.now());

                UtilRecords.NotificationDto setReadNotif = new UtilRecords.NotificationDto(notificationToBeSaved.getMessage(),
                        notificationToBeSaved.getTitle()
                        ,notificationToBeSaved.getId(),false,null,null,notifReader,true);
                System.out.println(notificationToBeSaved);

                finalNotifications.add(setReadNotif);
                notificationRepository.save(notificationToBeSaved);}



            return finalNotifications;}


        public List<NotificationModel> getAllMyNotifications(@Valid String user) {
            String validUser = userHandler.getCurrentUser();

            if (!user.equals(validUser)){
                System.out.println("How is this happening  tho");
                System.out.println(" Notif reader "   + validUser);
                System.out.println(" User from user handler "   + user);}

            return notificationRepository.findByReceiver(validUser);
        }



        public void handleDispatchTracking(UtilRecords.StartTrackingDTO trackingEvent) {
            String receiver = trackingEvent.dispatchRequester();
            if (receiver == null) {
                throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
            }

            String message = "Hello Your vehicle tracking for" +  trackingEvent.vehicleName()  + "  has begun hope you enjoy  your dispatch or wtv";

            NotificationModel notificationModel = new NotificationModel();

            // Set up the notification model
            notificationModel.setCreatedAt(LocalDateTime.now());
            notificationModel.setTitle("Dispatch Request");
            notificationModel.setRead(false);
            notificationModel.setReceiver(receiver);
            notificationModel.setType(LogEnums.NotificationType.INFO);
            notificationModel.setMessage(message);

            // Save and send notification
            NotificationModel savedNotification = notificationRepository.save(notificationModel);

            UtilRecords.NotificationDto dispatchTrackingNotif = new UtilRecords.NotificationDto(savedNotification.getMessage(),
                    savedNotification.getTitle()
                    ,savedNotification.getId(),false,null,null,receiver,true);


            System.out.println("✅ Dispatch creation notification saved.");
            System.out.println(savedNotification);
            notificationEmitterService.sendUserNotification(receiver, dispatchTrackingNotif);
        }
    }
