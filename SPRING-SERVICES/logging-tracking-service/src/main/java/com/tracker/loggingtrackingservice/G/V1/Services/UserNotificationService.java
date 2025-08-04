    package com.tracker.loggingtrackingservice.G.V1.Services;

    import com.tracker.loggingtrackingservice.G.V1.Config.UserHandler;
    import com.tracker.loggingtrackingservice.G.V1.Exceptions.AccessException;
    import com.tracker.loggingtrackingservice.G.V1.Exceptions.InvalidTaskRequestException;
    import com.tracker.loggingtrackingservice.G.V1.Exceptions.NotFoundException;
    import com.tracker.loggingtrackingservice.G.V1.Models.UserNotificationModel;
    import com.tracker.loggingtrackingservice.G.V1.Repositories.UserNotificationRepository;
    import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
    import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
    import jakarta.transaction.Transactional;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.time.format.DateTimeFormatter;
    import java.util.*;


    @Service
    public class UserNotificationService {



        private final UserNotificationRepository userNotificationRepository;
        private final UserHandler userHandler;
        private final TrackingService trackingService;


        public UserNotificationService(UserNotificationRepository userNotificationRepository, UserHandler userHandler, TrackingService trackingService) {
            this.userNotificationRepository = userNotificationRepository;
            this.userHandler = userHandler;
            this.trackingService = trackingService;
        }



        @Transactional
        public void sendCreatedDispatchNotification(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
            String receiver = dispatchEvent.dispatchRequester();
            if (receiver == null) {
                throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' h:mm a");

            String readableDateTime = dispatchEvent.dispatchEndTime().format(formatter);

            String message = "Hello your request for "+ dispatchEvent.vehicleName() +  " is being processed we believe you want to use the vehicle for " + dispatchEvent.dispatchReason() + " till " + readableDateTime;

            UserNotificationModel userNotificationModel = new UserNotificationModel();

            // Set up the notification model
            userNotificationModel.setCreatedAt(LocalDateTime.now());
            userNotificationModel.setTitle("Your Dispatch Request for " + dispatchEvent.vehicleName());
            userNotificationModel.setRead(false);
            userNotificationModel.setReceiver(receiver);
            userNotificationModel.setType(LogEnums.NotificationType.INFO);
            userNotificationModel.setMessage(message);
            userNotificationModel.setGoodNotificationCta("Okay, cool");
            userNotificationModel.setActionNotif(false);
            userNotificationModel.setDispatchId(dispatchEvent.dispatchId());
            userNotificationModel.setVehicleId(dispatchEvent.vehicleIdentificationNumber());
            userNotificationRepository.save(userNotificationModel);
        }



        @Transactional
        public void handleValidatedDispatchNotif(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {
            String receiver = dispatchValidatedEvent.dispatchRequester();

            if (receiver == null) {
                System.err.println("❌ Validated dispatch requester is null, cannot send notification.");
                return;
            }
            String message = "Your request for the " + dispatchValidatedEvent.vehicleName()
                    + " has been validated. We believe you plan to use the vehicle for "
                    + dispatchValidatedEvent.dispatchReason() + ".\nEnjoy your dispatch! (or wtv)";


            UserNotificationModel pastDispatchNotif = userNotificationRepository.findByDispatchIdAndVehicleId(dispatchValidatedEvent.dispatchId(),dispatchValidatedEvent.vehicleIdentificationNumber());

            if(pastDispatchNotif == null){
                throw new NotFoundException("No Initialisation Notification for this dispatch");
            }

            UserNotificationModel newNotification = new UserNotificationModel();
            newNotification.setCreatedAt(LocalDateTime.now());
            newNotification.setTitle("Dispatch Validated !");
            newNotification.setRead(false);
            newNotification.setReceiver(receiver);
            newNotification.setType(LogEnums.NotificationType.DISPATCH_VALIDATED_USER);
            newNotification.setMessage(message);
            newNotification.setVehicleId(dispatchValidatedEvent.vehicleIdentificationNumber());
            newNotification.setDispatchId(dispatchValidatedEvent.dispatchId());
            newNotification.setBadNotificationCta("Cancel Dispatch");
            newNotification.setGoodNotificationCta("Start Tracking !");
            userNotificationRepository.save(newNotification);
        }



        // if a dispatch is completed do this
        public void completedDispatchNotification(UtilRecords.DispatchEndedDTO dispatchEvent) {
            String receiver = dispatchEvent.receiver();
            Boolean wasCancelled = dispatchEvent.wasCancelled();
            String message;
            if(wasCancelled){
                 message = "Hello your dispatch for the" + dispatchEvent.vehicleName()
                        + " has been cancelled....thank you for your using Auto Port";
            }

            message = "Hello your dispatch for the" + dispatchEvent.vehicleName()
                    + " is completed and has been expired....thank you for your using Auto Port";


       UserNotificationModel userNotificationModel = new UserNotificationModel();

            // Set up the notification model
            userNotificationModel.setCreatedAt(LocalDateTime.now());
            userNotificationModel.setTitle("Dispatch Request ");
            userNotificationModel.setRead(false);
            userNotificationModel.setReceiver(receiver);
            userNotificationModel.setType(LogEnums.NotificationType.INFO);
            userNotificationModel.setMessage(message);

            // Save and send notification
            UserNotificationModel savedNotification = userNotificationRepository.save(userNotificationModel);


            UtilRecords.NotificationDto dispatchCompletedNotif = new UtilRecords.NotificationDto(message, savedNotification.getTitle()
                    ,savedNotification.getId(),false,null,null,receiver,false);


            trackingService.stopTracking(dispatchEvent);
        }



        // set notifications to read
        @Transactional
        public void
        setNotificationToRead(UtilRecords.setReadRecord notificationToRead) {



                Optional<UserNotificationModel> foundNotification = userNotificationRepository.findById(notificationToRead.notifId());

                if(foundNotification.isEmpty()){

                  throw new NotFoundException("Notification not found...someone tampered with the code");}

                UserNotificationModel notificationToBeSaved = foundNotification.get();

                notificationToBeSaved.setRead(true);
                notificationToBeSaved.setReadAt(LocalDateTime.now());

                userNotificationRepository.save(notificationToBeSaved);
        }


        @Transactional
        public List<UserNotificationModel>
        setNotificationsToRead(List<UtilRecords.setReadRecord> notificationToRead) {

            String user = userHandler.getCurrentUser();


            for (UtilRecords.setReadRecord notification : notificationToRead){

                Optional<UserNotificationModel> foundNotification = userNotificationRepository.findById(notification.notifId());

                if(foundNotification.isEmpty()){

                    throw new NotFoundException("Notification not found...someone tampered with the code");}

                UserNotificationModel notificationToBeSaved = foundNotification.get();

                notificationToBeSaved.setRead(true);
                notificationToBeSaved.setReadAt(LocalDateTime.now());

                userNotificationRepository.save(notificationToBeSaved);}
            return userNotificationRepository.findAllByReceiver(user);
        }




        @Transactional
        public List<UserNotificationModel> getAllMyNotifications() {
            String validUser = userHandler.getCurrentUser();
            return userNotificationRepository.findAllByReceiver(validUser);
        }




        @Transactional
        public void handleDispatchTracking(UtilRecords.StartTrackingDTO trackingEvent) {
            String receiver = trackingEvent.dispatchRequester();
            if (receiver == null) {
                throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
            }

            String message = "Hello the " +  trackingEvent.vehicleName()  + " has being dispatched to you, enjoy  your dispatch (or wtv)";

            UserNotificationModel userNotificationModel = new UserNotificationModel();

            // Set up the notification model
            userNotificationModel.setCreatedAt(LocalDateTime.now());
            userNotificationModel.setTitle("Dispatch Request");
            userNotificationModel.setRead(false);
            userNotificationModel.setReceiver(receiver);
            userNotificationModel.setType(LogEnums.NotificationType.INFO);
            userNotificationModel.setMessage(message);

            userNotificationRepository.save(userNotificationModel);
        }

        public List<UserNotificationModel> getNotificationsAfter(String since) {

            String  user =  userHandler.getCurrentUser();
            LocalDateTime formatedTime = LocalDateTime.parse(since);
            return userNotificationRepository.findByReceiverAndCreatedAtAfter(user,formatedTime);
        }
    }
