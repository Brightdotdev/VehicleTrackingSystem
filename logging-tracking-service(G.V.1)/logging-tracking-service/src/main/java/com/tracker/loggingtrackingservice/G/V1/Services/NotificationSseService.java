package com.tracker.loggingtrackingservice.G.V1.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class NotificationSseService {

    // A single map to track all emitters regardless of role
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private static final Long DEFAULT_TIMEOUT = TimeUnit.MINUTES.toMillis(30);

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
    public void sendUserNotification(String email, Object notificationData) {
        SseEmitter emitter = emitters.get(email);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("USER_NOTIFICATION").data(notificationData));
            } catch (IOException e) {
                emitters.remove(email);
            }
        }
    }

    // Send admin notification
    public void sendAdminNotification(String adminId, Object notificationData) {
        SseEmitter emitter = emitters.get(adminId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("ADMIN_NOTIFICATION").data(notificationData));
            } catch (IOException e) {
                emitters.remove(adminId);
            }
        }
    }
}
