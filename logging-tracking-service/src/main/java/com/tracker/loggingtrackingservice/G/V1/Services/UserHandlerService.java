package com.tracker.loggingtrackingservice.G.V1.Services;

import com.tracker.loggingtrackingservice.G.V1.Models.AdminModel;
import com.tracker.loggingtrackingservice.G.V1.Repositories.AdminRepository;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class UserHandlerService {

    private final AdminRepository adminRepository;
    private final Logger logger = LoggerFactory.getLogger(UserHandlerService.class);

    public UserHandlerService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Transactional
    public Map<String, Object> createIfNotExists(UtilRecords.adminCreatedRequestBodyDto requestBody) {

        Map<String, Object> response = new HashMap<>();

        if (requestBody == null || requestBody.email() == null || requestBody.email().isBlank()) {
            logger.warn("Invalid admin creation request: {}", requestBody);
            response.put("createdNew", false);
            return response;
        }


            AdminModel foundAdmin = adminRepository.findByEmail(requestBody.email());

            if (foundAdmin != null) {
                response.put("createdNew", false);
                return response;
            }

            AdminModel newAdmin = new AdminModel();
            newAdmin.setEmail(requestBody.email());
            newAdmin.setJoinedAt(LocalDateTime.now());
            newAdmin.setValidated(true);
            adminRepository.save(newAdmin);

            response.put("createdNew", true);
            return response;



    }

}
