package com.example.AuthService.Services;

import com.example.AuthService.Exceptions.AccessException;
import com.example.AuthService.Exceptions.ConflictException;
import com.example.AuthService.Exceptions.NotFoundException;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Utils.UtilRecords;
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

import java.util.ArrayList;
import java.util.List;


@Service("userDetailsService")
public class UserDetailService implements UserDetailsService {



    private final UserService userService;
    private final AdminService adminService;

    private final PasswordEncoder passwordEncoder;


    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserDetailService(UserService userService, AdminService adminService, @Lazy AuthenticationManager authenticationManager, @Lazy PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.adminService = adminService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) {return userService.findByEmail(email);}



    @Transactional
    public UtilRecords.LoginServiceResponse handleOath2UserSignIn(UtilRecords.UserGoogleSignUp oAuth2User) {

        String email = oAuth2User.email();
        String name = oAuth2User.name();
        String imageUrl = oAuth2User.picture();
      UserModel authUser = userService.findOrCreateFromOAuth(email, name, imageUrl, "GOOGLE_USER_" + oAuth2User.sub() , oAuth2User.email_verified
              ());

        Authentication auth = new UsernamePasswordAuthenticationToken(
                authUser, // principal
                null, // no credentials for OAuth
                authUser.getAuthorities() // roles/authorities
        );
      return new UtilRecords.LoginServiceResponse(authUser,auth);
    }

    @Transactional
    public UtilRecords.LoginServiceResponse handleUserOath2UserLogIn(String email) {
        UserModel authUser = userService.logInFromAuth(email);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                authUser, // principal
                null, // no credentials for OAuth
                authUser.getAuthorities() // roles/authorities
        );
        return new UtilRecords.LoginServiceResponse(authUser,auth);
    }

    @Transactional
    public UtilRecords.LoginServiceResponse handleUserSignUp(UtilRecords.UserLocalSignUp request) {

        if (userService.existsByEmail(request.email())) {
            throw new ConflictException("User with email Already exists");
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
        UserModel newUser = userService.save(user);

        try {
            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (Exception e) {
            throw new ConflictException("Authentication failed after save");
        }

        // Return both user info and authentication token
        return new UtilRecords.LoginServiceResponse(newUser, auth);
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
        return new UtilRecords.LoginServiceResponse(user, auth);

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
        return new UtilRecords.LoginServiceResponse(authUser,auth);
    }


    @Transactional
    public UtilRecords.LoginServiceResponse handleAdminLocalSignUp(UtilRecords.AdminLocalSignUp request) {


        if (!adminService.isValidAdminRequest(request)) {
            throw new AccessException("Invalid Admin request");
        }

        Authentication auth;

        // Create new user object
        UserModel user = new UserModel();
        user.setName(request.name().trim());
        user.setEmail(request.email().trim());
        user.setPassword(passwordEncoder.encode(request.password().trim()));
        user.setProvider("LOCAL_ADMIN_USER");
        user.setRoles(List.of("ROLE_ADMIN"));

        UserModel newUser = userService.save(user);

        try {
            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (Exception e) {
            throw new ConflictException("Authentication failed after save");
        }

        // Return both user info and authentication token
        return new UtilRecords.LoginServiceResponse(newUser, auth);
    }



    @Transactional
    public UtilRecords.LoginServiceResponse handleAdminLogIn(UtilRecords.AdminLocalLogin adminReq) {

        UserModel user = adminService.localAdminLogin(adminReq);
        Authentication auth;
        try {
            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(adminReq.email(), adminReq.password()));

        } catch (Exception e) {
            throw new ConflictException("Authentication failed after save");
        }
        return new UtilRecords.LoginServiceResponse(user, auth);
    }
    @Transactional
    public UtilRecords.LoginServiceResponse handleOath2AdminSignUp(UtilRecords.AdminGoogleSignUp adminRequest) {

        UserModel authUser = adminService.handleOath2AdminSignUp(adminRequest);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                authUser, // principal
                null, // no credentials for OAuth
                authUser.getAuthorities() // roles/authorities
        );
        return new UtilRecords.LoginServiceResponse(authUser,auth);
    }


}
