package com.tracker.loggingtrackingservice.G.V1.Services;

import com.tracker.loggingtrackingservice.G.V1.Models.AdminModel;
import com.tracker.loggingtrackingservice.G.V1.Repositories.AdminRepository;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Service to handle creation and retrieval of Admin users.
 * Provides functionality to create an admin record if it does not exist.
 */
@Service("adminHandlerService")
public class UserHandlerService {

    private final AdminRepository adminRepository;
    private final Logger logger = LoggerFactory.getLogger(UserHandlerService.class);

    public UserHandlerService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    /**
     * Creates a new admin user if one with the given email does not already exist.
     *
     * @param requestBody DTO containing the admin's email and related data
     * @return Map with a key "createdNew" indicating if a new admin was created (true) or not (false)
     */
    @Transactional
    public Map<String, Object> createIfNotExists(UtilRecords.adminCreatedRequestBodyDto requestBody) {
        Map<String, Object> response = new HashMap<>();

        if (requestBody == null || requestBody.email() == null || requestBody.email().isBlank()) {
            logger.warn("Invalid admin creation request: {}", requestBody);
            response.put("createdNew", false);
            return response;
        }

        // Check if admin already exists by email
        AdminModel foundAdmin = adminRepository.findByEmail(requestBody.email());

        if (foundAdmin != null) {
            response.put("createdNew", false);
            return response;
        }

        // Create new admin record
        AdminModel newAdmin = new AdminModel();
        newAdmin.setEmail(requestBody.email());
        newAdmin.setJoinedAt(LocalDateTime.now());
        newAdmin.setValidated(true);

        adminRepository.save(newAdmin);

        response.put("createdNew", true);
        return response;
    }
}
