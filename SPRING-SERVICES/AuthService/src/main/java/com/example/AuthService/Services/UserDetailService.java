package com.example.AuthService.Services;

import com.example.AuthService.Exceptions.AccessException;
import com.example.AuthService.Exceptions.ConflictException;
import com.example.AuthService.Exceptions.NotFoundException;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Utils.UserEnums;
import com.example.AuthService.Utils.UtilRecords;
import com.example.AuthService.WebClient.LoggingWebClientService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Service("userDetailsService")
public class UserDetailService implements UserDetailsService {


    @Autowired
    private LoggingWebClientService LoggingWebClientService;


    private final UserService userService;
    private final AdminService adminService;

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    static Double newUserPoints = 5000.0;

    @Autowired
    public UserDetailService(UserService userService, AdminService adminService, @Lazy AuthenticationManager authenticationManager, @Lazy PasswordEncoder passwordEncoder, ResponseMapperService responseMapperService) {
        this.userService = userService;
        this.adminService = adminService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }
    public String generateUserLicence(String name) {
        String initials = name.replaceAll("[^A-Z]", "").substring(0, 2).toUpperCase();
        String timestamp = Long.toString(System.currentTimeMillis(), 36).toUpperCase();
        String rand = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return String.format("ME-%s-%s-%s", initials, timestamp, rand);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) {return userService.findByEmail(email);}



    @Transactional
    public UserModel getUserData(String email) {
        return userService.findByEmail(email);
    }

  @Transactional
    public void updateUserScore(String email, Double score, Long dispatchId) {

        UserModel user = userService.findByEmail(email);

      if(user == null){
          throw new NotFoundException("No User Found with tha credentials");
      }

      if(dispatchId == null){
          throw new NotFoundException("No Dispatch represented to update the scores");
      }


      List<Double> points = user.getDispatchPoints();

      Double userPrevScore =  points.isEmpty() ? 0.0 :  user.getDispatchPoints().getLast();
      Double finalScore = userPrevScore + score;

      user.addToDispatchPoint(finalScore);
      userService.save(user);
    }



    @Transactional
    public UtilRecords.LoginServiceResponse handleOath2UserSignIn(UtilRecords.UserGoogleSignUp oAuth2User) {

        String email = oAuth2User.email();
        String name = oAuth2User.name();
        String imageUrl = oAuth2User.picture();
      UserModel authUser = userService.findOrCreateFromOAuth(email, name, imageUrl, "GOOGLE_USER_" + oAuth2User.sub() , oAuth2User.email_verified
              ());

        Authentication auth = new UsernamePasswordAuthenticationToken(
                authUser,
                null,
                authUser.getAuthorities());

      return new UtilRecords.LoginServiceResponse(authUser,auth,authUser.getUserImage());
    }

    @Transactional
    public UtilRecords.LoginServiceResponse handleUserOath2UserLogIn(String email) {
        UserModel authUser = userService.logInFromAuth(email);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                authUser, // principal
                null, // no credentials for OAuth
                authUser.getAuthorities() // roles/authorities
        );
        return new UtilRecords.LoginServiceResponse(authUser,auth,authUser.getUserImage());
    }

    @Transactional
    public UtilRecords.LoginServiceResponse handleUserSignUp(UtilRecords.UserLocalSignUp request) {

        if (userService.existsByEmail(request.email())) {
            throw new ConflictException("User with that email Already exists");
        }
        Authentication auth;

        // Create new user object
        UserModel user = new UserModel();
        user.setName(request.name().trim());
        user.setEmail(request.email().trim());
        user.setPassword(passwordEncoder.encode(request.password().trim()));
        user.setProvider("LOCAL_USER");
        user.setRoles(List.of("ROLE_USER"));
        user.setUserImage(request.image());
        user.setLicenseKey(generateUserLicence(request.name().trim()));


        //        extra fields

        user.addToDispatchPoint(newUserPoints);
        LocalDateTime now = LocalDateTime.now();

        // Add 2 years to the current date and time
        LocalDateTime twoWeeks = now.plusWeeks(2);

        user.setLicenseExpiry(twoWeeks);
        user.setUserStatus(request.userStatus());
        UserModel newUser = userService.save(user);





            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));


        return new UtilRecords.LoginServiceResponse(newUser, auth, newUser.getUserImage());
    }




    @Transactional
    public UtilRecords.LoginServiceResponse handleUserLocalLogIn(UtilRecords.LocalLogin request) {


        if (!userService.existsByEmail(request.email())) {
            throw  new NotFoundException("User with that email doesn't exist");
        }
        UserModel user = userService.findByEmail(request.email());
        Authentication auth;
        try {
            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        } catch (Exception e) {
            throw new ConflictException("Authentication failed after save");
        }
        return new UtilRecords.LoginServiceResponse(user, auth,user.getUserImage());

    }



    // ADMIN STUFF


    @Transactional
    public UtilRecords.LoginServiceResponse handleOath2AdminLogIn(UtilRecords.AdminGoogleLogIn adminReqKey) {

        UserModel authUser = adminService.logInFromOauth(adminReqKey);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                authUser, // principal
                null, // no credentials for OAuth
                authUser.getAuthorities() // roles/authorities
        );
        return new UtilRecords.LoginServiceResponse(authUser,auth,authUser.getUserImage());
    }


    @Transactional
    public UtilRecords.LoginServiceResponse handleOath2AdminSignUp(UtilRecords.AdminGoogleSignUp adminRequest) {

        UserModel authUser = adminService.handleOath2AdminSignUp(adminRequest);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                authUser,
                null,
                authUser.getAuthorities()
        );
        return new UtilRecords.LoginServiceResponse(authUser,auth,authUser.getUserImage());
    }



    @Transactional
    public UtilRecords.LoginServiceResponse handleAdminLocalSignUp(UtilRecords.AdminLocalSignUp request) {

         UserModel newUser = adminService.handleAdminLocalSignUp(request);
         Authentication    auth = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.email(), request.password()));


            return new UtilRecords.LoginServiceResponse(newUser, auth,newUser.getUserImage());
    }



    @Transactional
    public UtilRecords.LoginServiceResponse handleAdminLogIn(UtilRecords.AdminLocalLogin adminReq) {

        UserModel user = adminService.localAdminLogin(adminReq);
        Authentication auth;


            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(adminReq.email(), adminReq.password()));

            return new UtilRecords.LoginServiceResponse(user, auth,user.getUserImage());
    }


}
