    package com.tracker.loggingtrackingservice.G.V1.Services;

    import com.tracker.loggingtrackingservice.G.V1.Config.UserHandler;
    import com.tracker.loggingtrackingservice.G.V1.Exceptions.AccessException;
    import com.tracker.loggingtrackingservice.G.V1.Exceptions.InvalidTaskRequestException;
    import com.tracker.loggingtrackingservice.G.V1.Exceptions.NotFoundException;
    import com.tracker.loggingtrackingservice.G.V1.Models.AdminModel;
    import com.tracker.loggingtrackingservice.G.V1.Models.NotificationModel;
    import com.tracker.loggingtrackingservice.G.V1.Repositories.AdminRepository;
    import com.tracker.loggingtrackingservice.G.V1.Repositories.NotificationRepository;
    import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
    import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
    import jakarta.transaction.Transactional;
    import jakarta.validation.Valid;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.time.format.DateTimeFormatter;
    import java.util.*;
    import java.util.stream.Collectors;


    @Service
    public class NotificationService {



        private final NotificationRepository notificationRepository;
        private final UserHandler userHandler;
        private final TrackingService trackingService;
        private final NotificationSseService notificationEmitterService;

        private final AdminRepository adminRepository;

        public NotificationService(NotificationRepository notificationRepository, UserHandler userHandler, TrackingService trackingService, NotificationSseService notificationEmitterService, AdminRepository adminRepository) {
            this.notificationRepository = notificationRepository;
            this.userHandler = userHandler;
            this.trackingService = trackingService;
            this.notificationEmitterService = notificationEmitterService;
            this.adminRepository = adminRepository;
        }



        @Transactional
        public void sendCreatedDispatchNotification(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
            String receiver = dispatchEvent.dispatchRequester();
            if (receiver == null) {
                throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' h:mm a");

            String readableDateTime = dispatchEvent.dispatchEndTime().format(formatter);

            String message = "Hello your request for dispatch "+ dispatchEvent.vehicleName() +  " is being processed we believe you want to use the vehicle for " + dispatchEvent.dispatchReason() + " till " + readableDateTime;

            NotificationModel notificationModel = new NotificationModel();

            // Set up the notification model
            notificationModel.setCreatedAt(LocalDateTime.now());
            notificationModel.setTitle("Your Dispatch Request for " + dispatchEvent.vehicleName());
            notificationModel.setRead(false);
            notificationModel.setReceiver(receiver);
            notificationModel.setType(LogEnums.NotificationType.INFO);
            notificationModel.setMessage(message);
            notificationModel.setGoodNotificationCta("Okay, cool");
            notificationModel.setActionNotif(false);
            notificationModel.setDispatchId(dispatchEvent.dispatchId());
            notificationModel.setVehicleId(dispatchEvent.vehicleIdentificationNumber());
            notificationRepository.save(notificationModel);
        }


        @Transactional
        public void sendCreatedDispatchNotificationsForAdmin(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {

            String receiver = dispatchEvent.dispatchRequester();
            if (receiver == null) {
                throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
            }

            List<AdminModel> adminModelList = adminRepository.findAll();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' h:mm a");

            String readableDateTime = dispatchEvent.dispatchEndTime().format(formatter);

            String message = "Vehicle of VIN " + dispatchEvent.vehicleIdentificationNumber()
                    + " is requested for dispatch from " + receiver
                    + " for " + dispatchEvent.dispatchReason() + " till " + readableDateTime;


                for (AdminModel admin : adminModelList){
               NotificationModel notificationModel = new NotificationModel();
            // Set up the notification model
            notificationModel.setCreatedAt(LocalDateTime.now());
            notificationModel.setTitle("Dispatch Request Alert for " + dispatchEvent.vehicleName());
            notificationModel.setRead(false);
            notificationModel.setType(LogEnums.NotificationType.DISPATCH_CREATED_ADMIN);
            notificationModel.setMessage(message);
            notificationModel.setGoodNotificationCta("Check Dispatch Out");
            notificationModel.setBadNotificationCta("Not My Problem");
            notificationModel.setActionNotif(true);
            notificationModel.setReceiver(admin.getEmail());
            notificationRepository.save(notificationModel);
                }

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


            NotificationModel pastDispatchNotif = notificationRepository.findByDispatchIdAndVehicleId(dispatchValidatedEvent.dispatchId(),dispatchValidatedEvent.vehicleIdentificationNumber());

            if(pastDispatchNotif == null){
                throw new NotFoundException("No Initialisation Notification for this dispatch");
            }

            NotificationModel newNotification = new NotificationModel();
            newNotification.setCreatedAt(LocalDateTime.now());
            newNotification.setTitle("Dispatch Validated !");
            newNotification.setRead(false);
            newNotification.setReceiver(receiver);
            newNotification.setType(LogEnums.NotificationType.SUCCESS);
            newNotification.setMessage(message);
            newNotification.setVehicleId(dispatchValidatedEvent.vehicleIdentificationNumber());
            newNotification.setDispatchId(dispatchValidatedEvent.dispatchId());
            newNotification.setBadNotificationCta("Cancel Dispatch");
            newNotification.setGoodNotificationCta("Start Tracking !");
            notificationRepository.save(newNotification);
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


            notificationEmitterService.sendUserNotification(receiver, dispatchCompletedNotif);
            trackingService.stopTracking(dispatchEvent);
        }



        // set notifications to read
        @Transactional
        public List<NotificationModel>
        setNotificationToRead(List<UtilRecords.setReadRecord> notificationToRead,
                              String notifReader) {

            String user = userHandler.getCurrentUser();

            if (!user.equals(notifReader)){

        throw new AccessException("Contradicting user and notifications to be sent to");
            }

            for (UtilRecords.setReadRecord notification : notificationToRead){

                Optional<NotificationModel> foundNotification = notificationRepository.findById(notification.notifId());

                if(foundNotification.isEmpty()){

                  throw new NotFoundException("Notification not found...someone tampered with the code");}

                NotificationModel notificationToBeSaved = foundNotification.get();

                notificationToBeSaved.setRead(true);
                notificationToBeSaved.setReadAt(LocalDateTime.now());

                notificationRepository.save(notificationToBeSaved);}
            return notificationRepository.findAllByReceiver(notifReader);
        }


        @Transactional
        public List<NotificationModel> getAllMyNotifications(@Valid String user) {
            String validUser = userHandler.getCurrentUser();

            if (!user.equals(validUser)){
                System.out.println("How is this happening  tho");
                System.out.println(" Notif reader "   + validUser);
                System.out.println(" User from user handler "   + user);}

            return notificationRepository.findAllByReceiver(validUser);
        }




        @Transactional
        public void handleDispatchTracking(UtilRecords.StartTrackingDTO trackingEvent) {
            String receiver = trackingEvent.dispatchRequester();
            if (receiver == null) {
                throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
            }

            String message = "Hello the " +  trackingEvent.vehicleName()  + " has being dispatched to you enjoy  your dispatch (or wtv)";

            NotificationModel notificationModel = new NotificationModel();

            // Set up the notification model
            notificationModel.setCreatedAt(LocalDateTime.now());
            notificationModel.setTitle("Dispatch Request");
            notificationModel.setRead(false);
            notificationModel.setReceiver(receiver);
            notificationModel.setType(LogEnums.NotificationType.INFO);
            notificationModel.setMessage(message);

            notificationRepository.save(notificationModel);
        }

        public List<NotificationModel> getNotificationsAfter(String since) {

            String  user =  userHandler.getCurrentUser();
            LocalDateTime formatedTime = LocalDateTime.parse(since);
            return notificationRepository.findByReceiverAndCreatedAtAfter(user,formatedTime);
        }
    }
