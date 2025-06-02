package com.tracker.loggingtrackingservice.G.V1.Services;

import com.tracker.loggingtrackingservice.G.V1.Models.AdminModel;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords.NotificationDto;
import com.tracker.loggingtrackingservice.G.V1.Repositories.AdminRepository;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class NotificationSseService {

        private final AdminRepository adminRepository;

    // A single map to track all emitters regardless of role
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private static final Long DEFAULT_TIMEOUT = TimeUnit.MINUTES.toMillis(30);

    public NotificationSseService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    // Subscribe method - could be used by both users and admins
    public SseEmitter subscribe(String clientId) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitters.put(clientId, emitter);

        // Clean up on lifecycle events
        emitter.onCompletion(() -> emitters.remove(clientId));
        emitter.onTimeout(() -> emitters.remove(clientId));
        emitter.onError((e) -> emitters.remove(clientId));

        // Optional initial event
        try {
            emitter.send(SseEmitter.event().name("INIT").data("Connected to notification stream."));
        } catch (IOException e) {
            emitter.completeWithError(e);
        }

        return emitter;
    }

    // Send user notification
    public void sendUserNotification(String email, UtilRecords.NotificationDto notificationData) {
        SseEmitter emitter = emitters.get(email);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("USER_NOTIFICATION").data(notificationData));
            } catch (IOException e) {
                emitters.remove(email);
            }
        }
    }

    public void sendUserDispatchNotification(String email, UtilRecords.NotificationDto notificationData) {
        SseEmitter emitter = emitters.get(email);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("DISPATCH_USER_NOTIFICATION").data(notificationData));
            } catch (IOException e) {
                emitters.remove(email);
            }
        }
    }

    // Send admin notification
    public void sendAdminNotification(String adminId, UtilRecords.NotificationDto notificationData) {
        SseEmitter emitter = emitters.get(adminId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("ADMIN_NOTIFICATION").data(notificationData));
            } catch (IOException e) {
                emitters.remove(adminId);
            }
        }
    }

    // Send admins notification
    public void sendAdminsNotification(UtilRecords.NotificationDto notificationData) {

        List<AdminModel> adminModelList = adminRepository.findAll();
        for (AdminModel admins : adminModelList ){
            String adminEmail = admins.getEmail();
            SseEmitter emitter = emitters.get(adminEmail);
            if (emitter != null) {
                try {
                    emitter.send(SseEmitter.event().name("ADMIN_NOTIFICATION").data(notificationData));
                } catch (IOException e) {
                    emitters.remove(adminEmail);
                }
            }
        }

    }
}
