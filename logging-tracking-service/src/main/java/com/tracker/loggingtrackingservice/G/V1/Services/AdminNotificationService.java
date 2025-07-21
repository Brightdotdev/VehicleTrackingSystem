package com.tracker.loggingtrackingservice.G.V1.Services;


import com.tracker.loggingtrackingservice.G.V1.Config.UserHandler;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.AccessException;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.InvalidTaskRequestException;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.NotFoundException;
import com.tracker.loggingtrackingservice.G.V1.Models.AdminModel;
import com.tracker.loggingtrackingservice.G.V1.Models.AdminNotificationModel;
import com.tracker.loggingtrackingservice.G.V1.Models.UserNotificationModel;
import com.tracker.loggingtrackingservice.G.V1.Repositories.AdminRepository;
import com.tracker.loggingtrackingservice.G.V1.Repositories.AdminNotificationRepository;
import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AdminNotificationService {



    private final AdminRepository adminRepository;
    private final UserHandler userHandler;
    private final AdminNotificationRepository adminNotificationRepository;



    public AdminNotificationService(AdminRepository adminRepository, UserHandler userHandler, AdminNotificationRepository adminNotificationRepository) {
        this.adminRepository = adminRepository;
        this.userHandler = userHandler;
        this.adminNotificationRepository = adminNotificationRepository;
    }


    @Transactional
    public void sendCreatedDispatchNotificationsForAdmin(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {


        String receiver = dispatchEvent.dispatchRequester();

        if (receiver == null) {
            throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' h:mm a");
        String readableDateTime = dispatchEvent.dispatchEndTime().format(formatter);


        String message = "Vehicle of VIN " + dispatchEvent.vehicleIdentificationNumber()
                + " is requested for dispatch from " + receiver
                + " for " + dispatchEvent.dispatchReason() + " till " + readableDateTime;

            AdminNotificationModel adminNotification = new AdminNotificationModel();

            // Set up the notification model
            adminNotification.setCreatedAt(LocalDateTime.now());
            adminNotification.setTitle("Dispatch Request Alert for " + dispatchEvent.vehicleName());
            adminNotification.setRead(false);
            adminNotification.setIsHandled(false);
            adminNotification.setType(LogEnums.NotificationType.DISPATCH_CREATED_ADMIN);
            adminNotification.setMessage(message);
            adminNotification.setGoodNotificationCta("Check Dispatch Out");
            adminNotification.setBadNotificationCta("Not My Problem");
            adminNotification.setActionNotif(true);

            adminNotificationRepository.save(adminNotification);
    }


    @Transactional
    public List<AdminNotificationModel> getAdminNotifications() {

        String user =  userHandler.getCurrentUser();
        AdminModel requester = adminRepository.findByEmail(user);
        if(requester == null){
            throw new AccessException("Not a valid admin");
        }
    return adminNotificationRepository.findAll();
    }



    // set notifications to read
    @Transactional
    public List<AdminNotificationModel>
    setNotificationToRead(List<UtilRecords.setReadRecord> notificationToRead,
                          String notifReader) {


        String user =  userHandler.getCurrentUser();
        AdminModel requester = adminRepository.findByEmail(user);
        if(requester == null){
            throw new AccessException("Not a valid admin");
        }

        for (UtilRecords.setReadRecord notification : notificationToRead){

            Optional<AdminNotificationModel> foundNotification = adminNotificationRepository.findById(notification.notifId());

            if(foundNotification.isEmpty()){

                throw new NotFoundException("Notification not found...someone tampered with the code");}

            AdminNotificationModel notificationToBeSaved = foundNotification.get();

            notificationToBeSaved.setRead(true);
            notificationToBeSaved.setReadAt(LocalDateTime.now());

            adminNotificationRepository.save(notificationToBeSaved);
        }
            return adminNotificationRepository.findAll();
    }




    public List<AdminNotificationModel> getNotificationsAfter(String since) {
        String  user =  userHandler.getCurrentUser();
        LocalDateTime formatedTime = LocalDateTime.parse(since);
        return adminNotificationRepository.findByCreatedAtAfter(formatedTime);
    }


}
