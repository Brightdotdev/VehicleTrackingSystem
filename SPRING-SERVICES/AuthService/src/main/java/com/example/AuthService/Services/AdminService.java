
package com.example.AuthService.Services;

import com.example.AuthService.Exceptions.AccessException;
import com.example.AuthService.Exceptions.ConflictException;
import com.example.AuthService.Exceptions.NotFoundException;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Repositories.UserRepository;
import com.example.AuthService.Utils.ApiResponse;
import com.example.AuthService.Utils.UserEnums;
import com.example.AuthService.Utils.UtilRecords;
import com.example.AuthService.WebClient.LoggingWebClientService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AdminService {
     Integer adminKey = 223344;

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final LoggingWebClientService LoggingWebClientService;
    private final ResponseMapperService responseMapperService;
    static Double newAdminPoints = 10000.0;
    public AdminService(PasswordEncoder passwordEncoder, UserRepository userRepository, LoggingWebClientService loggingWebClientService, ResponseMapperService responseMapperService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        LoggingWebClientService = loggingWebClientService;
        this.responseMapperService = responseMapperService;
    }

    public String generateAdminLicence(String name) {
        String initials = name.replaceAll("[^A-Z]", "").substring(0, 2).toUpperCase();
        String timestamp = Long.toString(System.currentTimeMillis(), 36).toUpperCase();
        String rand = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return String.format("VIP-%s-%s-%s-X-X-L", initials, timestamp, rand);
    }


    public UserModel findAdmin(String email) {

        UserModel foundAdmin = userRepository.findByEmail(email)
;
        System.out.println(foundAdmin);
        if(foundAdmin == null){
            throw new ConflictException("No Admin found with that credentials");
        }
        if(!foundAdmin.getRoles().contains("ROLE_ADMIN")){
            throw new AccessException("Not a valid admin !");
        }
        return foundAdmin;}


    public boolean adminExistsByEmail(String email) {
        List<UserModel> foundAdmins = userRepository.findAllByEmail(email);

        for (UserModel user : foundAdmins){
            if(user.getEmail().equals(email) && user.getRoles().contains("ROLE_ADMIN")){
                return true;
            }
            else if(user.getEmail().equals(email) && !user.getRoles().contains("ROLE_ADMIN")){
                throw new ConflictException("User already exists with that email...not an admin");
            }
        }
        return false;
    }

    public List<UserModel> findAll() {
        List<UserModel> allUsers =  userRepository.findAll();
        List<UserModel> foundAdmins = new ArrayList<>();
        for (UserModel admin : allUsers){
            if(!admin.getRoles().contains("ROLE_ADMIN")){
                continue;
            }
            foundAdmins.add(admin);
        }
        return foundAdmins;
    }



    @Transactional
    public UserModel logInFromOauth(UtilRecords.AdminGoogleLogIn adminReq) {

        if(
                !adminReq.adminKey().equals(adminKey.toString())
        ){
            throw new AccessException("Invalid admin key");
        }



        UserModel foundUser =  findAdmin(adminReq.email());
        if(
                !foundUser.getRoles().contains("ROLE_GOOGLE")
        ){
            throw new ConflictException("This is not a valid google user");
        }
        return foundUser;
    }




    @Transactional
    public UserModel localAdminLogin(UtilRecords.AdminLocalLogin adminReq) {

        if(
                !adminReq.adminKey().equals(adminKey.toString())
        ){
            throw new AccessException("Invalid admin key");
        }


        return findAdmin(adminReq.email());
    }







    public Boolean isValidAdminRequest(UtilRecords.AdminLocalSignUp requestBody) {


        if(!requestBody.adminKey().equals(adminKey.toString())){
            throw  new AccessException("Not a valid admin request invalid key");
        }

        if (adminExistsByEmail(requestBody.email())) {
            throw new ConflictException("Admin with that email already exists");
        }

        return true;
    }

    public Boolean isValidAdminRequestOauth(UtilRecords.AdminGoogleSignUp requestBody) {


        if(!requestBody.adminKey().equals(adminKey.toString())){
            throw  new AccessException("Not a valid admin request invalid key");
        }

        if (adminExistsByEmail(requestBody.email())) {
            throw new ConflictException("Admin with that email already exists");
        }


        return true;
    }



    @Transactional
    public UserModel handleOath2AdminSignUp(UtilRecords.AdminGoogleSignUp oAuth2User) {

        if(!isValidAdminRequestOauth(oAuth2User)){
            throw new AccessException("Not a valid admin for sign up");
        }
        String email = oAuth2User.email();
        String name = oAuth2User.name();
        String imageUrl = oAuth2User.picture();
        UserModel user = new UserModel();
        user.setEmail(email);
        user.setName(name);
        user.setUserImage(imageUrl);
        user.setProvider("GOOGLE_USER_" + oAuth2User.sub());
        user.setValidated(oAuth2User.email_verified());
        user.setRoles(List.of("ROLE_USER","ROLE_ADMIN",  "ROLE_GOOGLE"));
        user.setLicenseKey(generateAdminLicence(name.trim()));

        //        extra fields

        user.addToDispatchPoint(newAdminPoints);
        LocalDateTime now = LocalDateTime.now();

        // Add 2 years to the current date and time
        LocalDateTime twoYearsLater = now.plusYears(2);

        user.setLicenseExpiry(twoYearsLater);
        user.setUserStatus(UserEnums.UserRole.ADMIN);




        Mono<ApiResponse<Map<String, Object>>> logAdminCreatedResponse  =  LoggingWebClientService.sendAdminCreated(email.trim());

        ApiResponse<Map<String, Object>> apiResponse = logAdminCreatedResponse.block();


        Map<String, Object>  extractedResponse = responseMapperService.createdAdminResponse(apiResponse);

        Object dataObj = extractedResponse.get("data");

        if (!(dataObj instanceof Map)) {
            throw new ConflictException("Invalid data format from sync response");
        }

        Map<String, Object> data = (Map<String, Object>) dataObj;

        if (!data.containsKey("createdNew")) {
            throw new ConflictException("Unable to synchronize admin data. Try signing up again.");
        }

        Boolean createdNew = Boolean.TRUE.equals(data.get("createdNew"));

        if (!createdNew) {
            throw new ConflictException("Admin already exists. Try logging in.");
        }



        return userRepository.save(user);
    }


    @Transactional
    public UserModel handleAdminLocalSignUp(UtilRecords.AdminLocalSignUp localSignUpRequest) {


        if (!isValidAdminRequest(localSignUpRequest)) {
            throw new AccessException("Invalid Admin request");
        }


        // Create new user object
        UserModel user = new UserModel();
        user.setName(localSignUpRequest.name().trim());
        user.setEmail(localSignUpRequest.email().trim());
        user.setPassword(passwordEncoder.encode(localSignUpRequest.password().trim()));
        user.setProvider("LOCAL_ADMIN_USER");
        user.setRoles(List.of("ROLE_ADMIN"));
        user.setLicenseKey(generateAdminLicence(localSignUpRequest.name().trim()));




//        extra fields

        user.addToDispatchPoint(newAdminPoints);
        LocalDateTime now = LocalDateTime.now();

        // Add 2 years to the current date and time
        LocalDateTime twoYearsLater = now.plusYears(2);

        user.setLicenseExpiry(twoYearsLater);
        user.setUserStatus(UserEnums.UserRole.ADMIN);


        Mono<ApiResponse<Map<String, Object>>> logAdminCreatedResponse  =  LoggingWebClientService.sendAdminCreated(localSignUpRequest.email().trim());

        ApiResponse<Map<String, Object>> apiResponse = logAdminCreatedResponse.block();


        Map<String, Object>  extractedResponse = responseMapperService.createdAdminResponse(apiResponse);


        Object dataObj = extractedResponse.get("data");

        if (!(dataObj instanceof Map)) {
            throw new ConflictException("Invalid data format from sync response");
        }

        Map<String, Object> data = (Map<String, Object>) dataObj;

        if (!data.containsKey("createdNew")) {
            throw new ConflictException("Unable to synchronize admin data. Try signing up again.");
        }

        boolean createdNew = Boolean.TRUE.equals(data.get("createdNew"));

        if (!createdNew) {
            throw new ConflictException("Admin already exists. Try logging in.");
        }

        return userRepository.save(user);
    }

    public Integer getAdminKey() {
        return this.adminKey;
    }

}


