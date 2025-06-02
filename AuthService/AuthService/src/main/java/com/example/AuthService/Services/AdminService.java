
package com.example.AuthService.Services;

import com.example.AuthService.Exceptions.AccessException;
import com.example.AuthService.Exceptions.ConflictException;
import com.example.AuthService.Exceptions.NotFoundException;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.RabbitMq.RabbitMqSenderService;
import com.example.AuthService.Repositories.UserRepository;
import com.example.AuthService.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RabbitMqSenderService rabbitMqSenderService;
     Integer adminKey = 223344;


    public AdminService(UserRepository userRepository, RabbitMqSenderService rabbitMqSenderService) {
        this.userRepository = userRepository;
        this.rabbitMqSenderService = rabbitMqSenderService;
    }

    public UserModel findAdmin(String email) {
        UserModel foundAdmin = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
;
        if(!foundAdmin.getRoles().contains("ROLE_ADMIN")){
            System.out.println(foundAdmin.getRoles());
            System.out.println(foundAdmin.getEmail());
            System.out.println(foundAdmin.getUsername());
            throw new AccessException("Not a valid admin!");
        }
        return foundAdmin;}


    public boolean adminExistsByEmail(String email) {
        List<UserModel> foundAdmins = userRepository.findAllByEmail(email);

        for (UserModel user : foundAdmins){
            if(user.getEmail().equals(email) && user.getRoles().contains("ROLE_ADMIN")){
                return true;
            }
            else if(user.getEmail().equals(email) && !user.getRoles().contains("ROLE_ADMIN")){
                throw new ConflictException("User already exists with that emaiil...not an admin");
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



            return findAdmin(adminReq.email());}







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

        UtilRecords.adminCreatedRequestBodyDto adminReq = new UtilRecords.adminCreatedRequestBodyDto(email);

        Map<String , Object> logAdminCreatedResponse = rabbitMqSenderService.sendAdminCreated(adminReq);

        if(!logAdminCreatedResponse.containsKey("createdNew")){
        throw new ConflictException("Unable to synchronize admin data Try signing up again");
        }

        return userRepository.save(user);
    }


    public Integer getAdminKey() {
        return this.adminKey;
    }

}


