package com.example.AuthService.Services;

import com.example.AuthService.Exceptions.AccessException;
import com.example.AuthService.Exceptions.ConflictException;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Repositories.UserRepository;
import com.example.AuthService.Utils.*;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AdminService {

    private static final Integer ADMIN_KEY = 223344;
    private static final Double NEW_ADMIN_POINTS = 10000.0;

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final MessagingService messagingService;  // messaging abstraction
    private final ResponseMapperService responseMapperService;

    public AdminService(
            PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            MessagingService messagingService,
            ResponseMapperService responseMapperService
    ) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.messagingService = messagingService;
        this.responseMapperService = responseMapperService;
    }

    public Integer getAdminKey() {
        return ADMIN_KEY;
    }

    /**
     * Generate a license key for admins based on their name and a timestamp.
     */
    public String generateAdminLicence(String name) {
        String initials = name.replaceAll("[^A-Z]", "");
        if (initials.length() < 2) {
            initials = (initials + "XX").substring(0, 2);
        } else {
            initials = initials.substring(0, 2);
        }
        String timestamp = Long.toString(System.currentTimeMillis(), 36).toUpperCase();
        String rand = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return String.format("VIP-%s-%s-%s-X-X-L", initials, timestamp, rand);
    }

    /**
     * Find admin by email and validate role.
     */
    public UserModel findAdmin(String email) {
        AdminServiceUtils.validateEmailFormat(email);

        UserModel foundAdmin = userRepository.findByEmail(email);

        if (foundAdmin == null) {
            throw new ConflictException("No Admin found with that credentials");
        }
        if (!foundAdmin.getRoles().contains("ROLE_ADMIN")) {
            throw new AccessException("Not a valid admin!");
        }
        return foundAdmin;
    }

    /**
     * Check if admin exists by email.
     * Throws conflict if user with email exists but is not an admin.
     */
    public boolean adminExistsByEmail(String email) {
        AdminServiceUtils.validateEmailFormat(email);

        List<UserModel> foundUsers = userRepository.findAllByEmail(email);

        for (UserModel user : foundUsers) {
            if (user.getEmail().equals(email)) {
                if (user.getRoles().contains("ROLE_ADMIN")) {
                    return true;
                } else {
                    throw new ConflictException("User already exists with that email...not an admin");
                }
            }
        }
        return false;
    }

    /**
     * Internal method to sync admin creation event with external messaging service.
     */
    private void syncAdminCreated(String email) {
        ApiResponse<UtilRecords.UserSyncResponse> apiResponse = messagingService.sendAdminCreated(email);

        UtilRecords.UserSyncData syncData = getUserSyncData(apiResponse);
        if (syncData == null) {
            throw new ConflictException("No sync data details in response");
        }

        if (!syncData.createdNew()) {
            throw new ConflictException("Admin already exists. Try logging in.");
        }
    }

    private static UtilRecords.UserSyncData getUserSyncData(ApiResponse<UtilRecords.UserSyncResponse> apiResponse) {
        if (apiResponse == null) {
            throw new ConflictException("No response from admin creation sync");
        }

        if (!apiResponse.isSuccess()) {
            throw new ConflictException("Admin sync failed: " + apiResponse.getMessage());
        }

        UtilRecords.UserSyncResponse userSyncResponse = apiResponse.getData();
        if (userSyncResponse == null) {
            throw new ConflictException("No user sync data in response");
        }

        return userSyncResponse.data();
    }

    @Transactional
    public UserModel handleAdminLocalSignUp(UtilRecords.AdminLocalSignUp request) {
        AdminServiceUtils.validateAdminKey(request.adminKey(), ADMIN_KEY);
        AdminServiceUtils.validateName(request.name());
        AdminServiceUtils.validateEmailFormat(request.email());
        AdminServiceUtils.validatePasswordStrength(request.password());

        if (adminExistsByEmail(request.email())) {
            throw new ConflictException("Admin with that email already exists");
        }

        UserModel user = new UserModel();
        user.setName(request.name().trim());
        user.setEmail(request.email().trim());
        user.setPassword(passwordEncoder.encode(request.password().trim()));
        user.setProvider("LOCAL_ADMIN_USER");
        user.setRoles(List.of("ROLE_ADMIN"));
        user.setLicenseKey(generateAdminLicence(request.name().trim()));
        user.addToDispatchPoint(NEW_ADMIN_POINTS);
        user.setLicenseExpiry(LocalDateTime.now().plusYears(2));
        user.setUserStatus(UserEnums.UserRole.ADMIN);

        syncAdminCreated(user.getEmail());

        return userRepository.save(user);
    }

    @Transactional
    public UserModel handleOath2AdminSignUp(UtilRecords.AdminGoogleSignUp oAuth2User) {
        AdminServiceUtils.validateAdminKey(oAuth2User.adminKey(), ADMIN_KEY);
        AdminServiceUtils.validateEmailFormat(oAuth2User.email());
        AdminServiceUtils.validateName(oAuth2User.name());

        if (adminExistsByEmail(oAuth2User.email())) {
            throw new ConflictException("Admin with that email already exists");
        }

        UserModel user = new UserModel();
        user.setEmail(oAuth2User.email());
        user.setName(oAuth2User.name());
        user.setUserImage(oAuth2User.picture());
        user.setProvider("GOOGLE_USER_" + oAuth2User.sub());
        user.setValidated(oAuth2User.email_verified());
        user.setRoles(List.of("ROLE_USER", "ROLE_ADMIN", "ROLE_GOOGLE"));
        user.setLicenseKey(generateAdminLicence(oAuth2User.name().trim()));
        user.addToDispatchPoint(NEW_ADMIN_POINTS);
        user.setLicenseExpiry(LocalDateTime.now().plusYears(2));
        user.setUserStatus(UserEnums.UserRole.ADMIN);

        syncAdminCreated(user.getEmail());

        return userRepository.save(user);
    }

    @Transactional
    public UserModel logInFromOauth(UtilRecords.AdminGoogleLogIn adminReq) {
        AdminServiceUtils.validateAdminKey(adminReq.adminKey(), ADMIN_KEY);

        UserModel foundUser = findAdmin(adminReq.email());

        if (!foundUser.getRoles().contains("ROLE_GOOGLE")) {
            throw new ConflictException("This is not a valid google user");
        }

        return foundUser;
    }

    @Transactional
    public UserModel localAdminLogin(UtilRecords.AdminLocalLogin adminReq) {
        AdminServiceUtils.validateAdminKey(adminReq.adminKey(), ADMIN_KEY);

        return findAdmin(adminReq.email());
    }

    public List<UserModel> findAll() {
        List<UserModel> allUsers = userRepository.findAll();
        return allUsers.stream()
                .filter(user -> user.getRoles().contains("ROLE_ADMIN"))
                .toList();
    }

}
