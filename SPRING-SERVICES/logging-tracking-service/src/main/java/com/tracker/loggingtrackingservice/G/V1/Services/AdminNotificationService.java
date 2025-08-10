package com.tracker.loggingtrackingservice.G.V1.Services;

import com.tracker.loggingtrackingservice.G.V1.Config.UserHandler;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.AccessException;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.InvalidTaskRequestException;
import com.tracker.loggingtrackingservice.G.V1.Models.AdminModel;
import com.tracker.loggingtrackingservice.G.V1.Models.AdminNotificationModel;
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

/**
 * Service to manage admin notifications related to dispatches.
 * Responsible for creating, fetching, and updating notifications.
 */
@Service
public class AdminNotificationService {

    private final AdminRepository adminRepository;
    private final UserHandler userHandler;
    private final AdminNotificationRepository adminNotificationRepository;

    public AdminNotificationService(
            AdminRepository adminRepository,
            UserHandler userHandler,
            AdminNotificationRepository adminNotificationRepository
    ) {
        this.adminRepository = adminRepository;
        this.userHandler = userHandler;
        this.adminNotificationRepository = adminNotificationRepository;
    }

    /**
     * Creates and saves a notification for an admin about a newly created dispatch.
     *
     * @param dispatchEvent DTO containing dispatch creation details
     * @throws InvalidTaskRequestException if dispatch requester is null
     */
    @Transactional
    public void sendCreatedDispatchNotificationsForAdmin(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
        String receiver = dispatchEvent.dispatchRequester();

        if (receiver == null) {
            throw new InvalidTaskRequestException("The dispatch must have someone that requested it");
        }

        String message = buildNotificationMessage(dispatchEvent, receiver);

        AdminNotificationModel notification = buildAdminNotification(dispatchEvent, message);

        adminNotificationRepository.save(notification);
    }

    /**
     * Retrieves all admin notifications if current user is a valid admin.
     *
     * @return list of all AdminNotificationModel
     * @throws AccessException if current user is not a valid admin
     */
    @Transactional
    public List<AdminNotificationModel> getAdminNotifications() {
        String currentUser = userHandler.getCurrentUser();
        AdminModel admin = adminRepository.findByEmail(currentUser);
        if (admin == null) {
            throw new AccessException("Not a valid admin");
        }
        return adminNotificationRepository.findAll();
    }

    /**
     * Marks a given notification as read by the current user.
     *
     * @param notificationToBeRead DTO with notification ID to mark as read
     * @return true if current user was added to read list; false if notification not found
     */
    @Transactional
    public boolean markNotificationAsRead(UtilRecords.setReadRecord notificationToBeRead) {
        Optional<AdminNotificationModel> optionalNotification = adminNotificationRepository.findById(notificationToBeRead.notifId());
        if (optionalNotification.isEmpty()) {
            return false;
        }

        AdminNotificationModel notification = optionalNotification.get();

        String currentUser = userHandler.getCurrentUser();
        boolean addedToReadBy = notification.getReadBy().add(currentUser);

        if (!notification.getRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        }

        adminNotificationRepository.save(notification);
        return addedToReadBy;
    }

    /**
     * Retrieves notifications created after the specified timestamp.
     *
     * @param since ISO-8601 formatted datetime string
     * @return list of AdminNotificationModel created after given time
     */
    @Transactional
    public List<AdminNotificationModel> getNotificationsAfter(String since) {
        LocalDateTime parsedTime = LocalDateTime.parse(since);
        return adminNotificationRepository.findByCreatedAtAfter(parsedTime);
    }

    /* ===========================
       Private Helpers
       =========================== */

    /**
     * Builds a formatted notification message describing the dispatch request.
     */
    private String buildNotificationMessage(UtilRecords.dispatchRequestBodyDTO dispatchEvent, String receiver) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' h:mm a");
        String readableDateTime = dispatchEvent.dispatchEndTime().format(formatter);

        return "Vehicle of VIN " + dispatchEvent.vehicleIdentificationNumber()
                + " is requested for dispatch from " + receiver
                + " for " + dispatchEvent.dispatchReason() + " till " + readableDateTime;
    }

    /**
     * Constructs a new AdminNotificationModel for a dispatch notification.
     */
    private AdminNotificationModel buildAdminNotification(UtilRecords.dispatchRequestBodyDTO dispatchEvent, String message) {
        AdminNotificationModel notification = new AdminNotificationModel();

        notification.setCreatedAt(LocalDateTime.now());
        notification.setTitle("Dispatch Request Alert for " + dispatchEvent.vehicleName());
        notification.setRead(false);
        notification.setIsHandled(false);
        notification.setType(LogEnums.NotificationType.DISPATCH_CREATED_ADMIN);
        notification.setMessage(message);
        notification.setGoodNotificationCta("Check Dispatch Out");
        notification.setBadNotificationCta("Not My Problem");
        notification.setActionNotif(true);

        return notification;
    }
}
