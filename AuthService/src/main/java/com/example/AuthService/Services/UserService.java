package com.example.AuthService.Services;

import com.example.AuthService.Config.JwtConfig;
import com.example.AuthService.Exceptions.ConflictException;
import com.example.AuthService.Exceptions.NotFoundException;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class for managing user-related operations.
 * Handles local and OAuth-based user logic.
 */
@Service
public class UserService {

    private final UserRepository userRepository;



    public String generateUserLicence(String name) {
        String initials = name.replaceAll("[^A-Z]", "").substring(0, 2).toUpperCase();
        String timestamp = Long.toString(System.currentTimeMillis(), 36).toUpperCase();
        String rand = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return String.format("ME-%s-%s-%s", initials, timestamp, rand);
    }




    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;

    }


    public UserModel findByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    public UserModel save(UserModel user) {
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }


    public List<UserModel> findAll() {
        return userRepository.findAll();
    }


    @Transactional
    public UserModel findOrCreateFromOAuth(String email, String name, String imageUrl, String provider, boolean email_verified) {
        UserModel foundUser;

        foundUser = userRepository.findByEmail(email);

        if(foundUser == null){
            UserModel user = new UserModel();
                    user.setEmail(email);
                    user.setName(name);
                    user.setUserImage(imageUrl);
                    user.setProvider(provider);
                    user.setValidated(email_verified);
                    user.setLicenseKey(generateUserLicence(name));
                    user.setRoles(List.of("ROLE_USER", "ROLE_GOOGLE"));

                    return userRepository.save(user);
                }
        return foundUser;
    }


    @Transactional
    public UserModel logInFromAuth(String email) {
        UserModel foundUser = userRepository.findByEmail(email);

        if (foundUser == null) {
            throw new NotFoundException("Google user not found");
        }

        if (!foundUser.getRoles().contains("ROLE_GOOGLE")) {
            throw new ConflictException("This is not a valid Google user");
        }

        return foundUser;
    }

    @Transactional
    public UserModel localLogIn(String email) {
      UserModel foundUser = userRepository.findByEmail(email);

        if (foundUser ==  null) {
            throw new NotFoundException("Local user not found");
        }


        if (!foundUser.getRoles().contains("ROLE_USER")) {
            throw new ConflictException("This is not a valid local foundUser");
        }

        return foundUser;
    }







}
