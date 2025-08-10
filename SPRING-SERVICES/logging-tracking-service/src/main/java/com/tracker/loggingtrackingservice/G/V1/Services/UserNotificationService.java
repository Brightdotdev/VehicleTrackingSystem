package com.tracker.loggingtrackingservice.G.V1.Services;

import com.tracker.loggingtrackingservice.G.V1.Config.UserHandler;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.InvalidTaskRequestException;
import com.tracker.loggingtrackingservice.G.V1.Exceptions.NotFoundException;
import com.tracker.loggingtrackingservice.G.V1.Models.UserNotificationModel;
import com.tracker.loggingtrackingservice.G.V1.Repositories.UserNotificationRepository;
import com.tracker.loggingtrackingservice.G.V1.Utils.LogEnums;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * Service to manage user notifications related to dispatch lifecycle events.
 * Responsible for creating, updating, and retrieving notifications for users.
 */
@Service
public class UserNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(UserNotificationService.class);

    private final UserNotificationRepository userNotificationRepository;
    private final UserHandler userHandler;
    private final TrackingService trackingService;

    public UserNotificationService(
            UserNotificationRepository userNotificationRepository,
            UserHandler userHandler,
            TrackingService trackingService
    ) {
        this.userNotificationRepository = userNotificationRepository;
        this.userHandler = userHandler;
        this.trackingService = trackingService;
    }

    /**
     * Sends a notification to a user when a dispatch request is created.
     *
     * @param dispatchEvent Dispatch creation details
     * @throws InvalidTaskRequestException if the dispatch requester is null
     */
    @Transactional
    public void sendCreatedDispatchNotification(UtilRecords.dispatchRequestBodyDTO dispatchEvent) {
        String receiver = requireDispatchRequester(dispatchEvent.dispatchRequester());

        String message = buildDispatchRequestMessage(dispatchEvent, receiver);

        UserNotificationModel notification = buildUserNotification(dispatchEvent, receiver, message, LogEnums.NotificationType.INFO);
        userNotificationRepository.save(notification);
    }

    /**
     * Sends a notification when a dispatch has been validated.
     *
     * @param dispatchValidatedEvent Details of the validated dispatch
     * @throws NotFoundException if initial notification for this dispatch is missing
     */
    @Transactional
    public void handleValidatedDispatchNotif(UtilRecords.ValidatedDispatch dispatchValidatedEvent) {
        String receiver = dispatchValidatedEvent.dispatchRequester();

        if (receiver == null) {
            logger.error("❌ Validated dispatch requester is null, cannot send notification.");
            return; // Early return to avoid null pointer
        }

        Optional<UserNotificationModel> pastNotif = userNotificationRepository.findFirstByDispatchIdAndVehicleId(
                dispatchValidatedEvent.dispatchId(), dispatchValidatedEvent.vehicleIdentificationNumber());

        if (pastNotif.isEmpty()) {
            throw new NotFoundException("No Initialization Notification for this dispatch");
        }

        String message = "Your request for the " + dispatchValidatedEvent.vehicleName()
                + " has been validated. We believe you plan to use the vehicle for "
                + dispatchValidatedEvent.dispatchReason() + ". Enjoy your dispatch!";

        UserNotificationModel newNotification = buildUserNotification(
                dispatchValidatedEvent,
                receiver,
                message,
                LogEnums.NotificationType.DISPATCH_VALIDATED_USER);

        newNotification.setBadNotificationCta("Cancel Dispatch");
        newNotification.setGoodNotificationCta("Start Tracking !");

        userNotificationRepository.save(newNotification);
    }

    /**
     * Sends a notification when a dispatch is completed or cancelled,
     * and stops tracking for the dispatch.
     *
     * @param dispatchEvent Details about dispatch completion or cancellation
     */
    @Transactional
    public void completedDispatchNotification(UtilRecords.DispatchEndedDTO dispatchEvent) {
        logger.info("Entered completedDispatchNotification method");

        String receiver = dispatchEvent.receiver();
        boolean wasCancelled = dispatchEvent.wasCancelled();
        String vehicleName = dispatchEvent.vehicleName();

        trackingService.stopTracking(dispatchEvent);
        logger.debug("Dispatch event details - Receiver: {}, Vehicle: {}, WasCancelled: {}", receiver, vehicleName, wasCancelled);

        String message = wasCancelled
                ? "Hello your dispatch for the " + vehicleName + " has been cancelled....thank you for using Auto Port"
                : "Hello your dispatch for the " + vehicleName + " is completed and has expired....thank you for using Auto Port";

        logger.info("Dispatch status message set.");

        UserNotificationModel notification = new UserNotificationModel();
        notification.setCreatedAt(LocalDateTime.now());
        notification.setTitle("Dispatch Request ");
        notification.setRead(false);
        notification.setReceiver(receiver);
        notification.setType(LogEnums.NotificationType.INFO);
        notification.setMessage(message);

        logger.debug("Notification model populated: {}", notification);

        UserNotificationModel savedNotification = userNotificationRepository.save(notification);

        logger.info("Notification saved with ID: {}", savedNotification.getId());

        // Stop tracking for the dispatch
        logger.info("Tracking stopped for dispatch event.");
    }

    /**
     * Marks a single notification as read.
     *
     * @param notificationToRead DTO containing notification ID
     * @throws NotFoundException if notification not found
     */
    @Transactional
    public void setNotificationToRead(UtilRecords.setReadRecord notificationToRead) {
        UserNotificationModel notification = userNotificationRepository.findById(notificationToRead.notifId())
                .orElseThrow(() -> new NotFoundException("Notification not found...someone tampered with the code"));

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());

        userNotificationRepository.save(notification);
    }

    /**
     * Marks multiple notifications as read.
     *
     * @param notificationsToRead List of DTOs containing notification IDs
     * @return updated list of notifications for the current user
     * @throws NotFoundException if any notification is not found
     */
    @Transactional
    public List<UserNotificationModel> setNotificationsToRead(List<UtilRecords.setReadRecord> notificationsToRead) {
        String currentUser = userHandler.getCurrentUser();

        for (UtilRecords.setReadRecord notificationDto : notificationsToRead) {
            UserNotificationModel notification = userNotificationRepository.findById(notificationDto.notifId())
                    .orElseThrow(() -> new NotFoundException("Notification not found...someone tampered with the code"));

            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());

            userNotificationRepository.save(notification);
        }

        return userNotificationRepository.findAllByReceiver(currentUser);
    }

    /**
     * Retrieves all notifications for the current user.
     *
     * @return list of user notifications
     */
    @Transactional
    public List<UserNotificationModel> getAllMyNotifications() {
        String currentUser = userHandler.getCurrentUser();
        return userNotificationRepository.findAllByReceiver(currentUser);
    }

    /**
     * Sends a notification when tracking starts for a dispatch.
     *
     * @param trackingEvent Details about the tracking start
     * @throws InvalidTaskRequestException if dispatch requester is null
     */
    @Transactional
    public void handleDispatchTracking(UtilRecords.StartTrackingDTO trackingEvent) {
        String receiver = requireDispatchRequester(trackingEvent.dispatchRequester());

        String message = "Hello the " + trackingEvent.vehicleName() + " has been dispatched to you, enjoy your dispatch (or wtv)";

        UserNotificationModel notification = new UserNotificationModel();
        notification.setCreatedAt(LocalDateTime.now());
        notification.setTitle("Dispatch Request");
        notification.setRead(false);
        notification.setReceiver(receiver);
        notification.setType(LogEnums.NotificationType.INFO);
        notification.setMessage(message);

        userNotificationRepository.save(notification);
    }

    /**
     * Retrieves notifications created after a specified datetime for the current user.
     *
     * @param since ISO-8601 datetime string
     * @return list of user notifications created after the given time
     */
    public List<UserNotificationModel> getNotificationsAfter(String since) {
        String currentUser = userHandler.getCurrentUser();
        LocalDateTime formattedTime = LocalDateTime.parse(since);
        return userNotificationRepository.findByReceiverAndCreatedAtAfter(currentUser, formattedTime);
    }

    /* ===========================
       Private Helpers
       =========================== */

    /**
     * Helper to validate that a dispatch requester is present.
     *
     * @param requester the dispatch requester
     * @return the requester if valid
     * @throws InvalidTaskRequestException if requester is null
     */
    private String requireDispatchRequester(String requester) {
        if (requester == null) {
            throw new InvalidTaskRequestException("The dispatch must have someone that requested for it");
        }
        return requester;
    }

    /**
     * Helper to build a formatted message for a dispatch request notification.
     */
    private String buildDispatchRequestMessage(UtilRecords.dispatchRequestBodyDTO dispatchEvent, String receiver) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' h:mm a");
        String readableDateTime = dispatchEvent.dispatchEndTime().format(formatter);

        return "Hello your request for " + dispatchEvent.vehicleName() +
                " is being processed we believe you want to use the vehicle for " + dispatchEvent.dispatchReason() +
                " till " + readableDateTime;
    }

    /**
     * Helper to build a UserNotificationModel from dispatch event and message.
     */
    private UserNotificationModel buildUserNotification(
            UtilRecords.dispatchRequestBodyDTO dispatchEvent,
            String receiver,
            String message,
            LogEnums.NotificationType type
    ) {
        UserNotificationModel notification = new UserNotificationModel();
        notification.setCreatedAt(LocalDateTime.now());
        notification.setTitle("Your Dispatch Request for " + dispatchEvent.vehicleName());
        notification.setRead(false);
        notification.setReceiver(receiver);
        notification.setType(type);
        notification.setMessage(message);
        notification.setGoodNotificationCta("Okay, cool");
        notification.setActionNotif(false);
        notification.setDispatchId(dispatchEvent.dispatchId());
        notification.setVehicleId(dispatchEvent.vehicleIdentificationNumber());

        return notification;
    }

    /**
     * Overloaded helper to build notification for validated dispatch.
     */
    private UserNotificationModel buildUserNotification(
            UtilRecords.ValidatedDispatch validatedDispatch,
            String receiver,
            String message,
            LogEnums.NotificationType type
    ) {
        UserNotificationModel notification = new UserNotificationModel();
        notification.setCreatedAt(LocalDateTime.now());
        notification.setTitle("Dispatch Validated !");
        notification.setRead(false);
        notification.setReceiver(receiver);
        notification.setType(type);
        notification.setMessage(message);
        notification.setVehicleId(validatedDispatch.vehicleIdentificationNumber());
        notification.setDispatchId(validatedDispatch.dispatchId());

        return notification;
    }
}
