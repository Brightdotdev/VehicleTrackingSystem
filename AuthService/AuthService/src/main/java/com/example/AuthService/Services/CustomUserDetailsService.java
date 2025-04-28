package com.example.AuthService.Services;

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
public class CustomUserDetailsService implements UserDetailsService {



    @Autowired
    private  UserService userService;


    private final PasswordEncoder passwordEncoder;


    private final AuthenticationManager authenticationManager;

    @Autowired
    public CustomUserDetailsService(@Lazy AuthenticationManager authenticationManager, @Lazy PasswordEncoder passwordEncoder) {
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
    public UtilRecords.LoginServiceResponse handleLocalSignUp(UtilRecords.UserLocalSignUp request) {// Check if the user already exists by email

        if (userService.existsByEmail(request.email())) {
            throw new ConflictException("User with email Already exists");
        }

        // Prepare user roles
        List<String> finalRoles = new ArrayList<>();
        if (request.roles() != null && !request.roles().isEmpty()) {
            for (String role : request.roles()) {
                finalRoles.add(role.trim().toUpperCase());
            }
        } else {
            finalRoles.add("ROLE_USER");
        }

        // Create new user object
        UserModel user = new UserModel();
        user.setName(request.name().trim());
        user.setEmail(request.email().trim());
        user.setPassword(passwordEncoder.encode(request.password().trim())); // hash the password
        user.setProvider("LOCAL_USER");
        user.setRoles(finalRoles);

        UserModel newUser = userService.save(user);


        Authentication auth;
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
    public UtilRecords.LoginServiceResponse handleLocalLogIn(UtilRecords.LocalLogin request) {


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

}
