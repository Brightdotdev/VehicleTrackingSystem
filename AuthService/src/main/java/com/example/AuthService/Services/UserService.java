package com.example.AuthService.Services;

import com.example.AuthService.Exceptions.ConflictException;
import com.example.AuthService.Exceptions.NotFoundException;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for managing user-related operations.
 * Handles local and OAuth-based user logic.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    /**
     * Constructor for dependency injection.
     *
     * @param userRepository the user repository bean
     */
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Finds a user by their email.
     *
     * @param email the user's email
     * @return the found user
     * @throws NotFoundException if user is not found
     */
    public UserModel findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Saves a user to the database.
     *
     * @param user the user to save
     * @return the saved user
     */
    public UserModel save(UserModel user) {
        return userRepository.save(user);
    }

    /**
     * Checks if a user exists by email.
     *
     * @param email the email to check
     * @return true if exists, false otherwise
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Fetches all users in the database.
     *
     * @return list of all users
     */
    public List<UserModel> findAll() {
        return userRepository.findAll();
    }

    /**
     * Finds or creates a user using OAuth data (Google).
     * If user does not exist, creates a new one with ROLE_USER and ROLE_GOOGLE.
     *
     * @param email          the user's email
     * @param name           the user's name
     * @param imageUrl       the user's profile image URL
     * @param provider       the provider (e.g., GOOGLE_USER_xxx)
     * @param email_verified whether the email is verified
     * @return the existing or newly created user
     */
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
                    user.setRoles(List.of("ROLE_USER", "ROLE_GOOGLE"));
                    return userRepository.save(user);
                }
        return foundUser;
    }

    /**
     * Retrieves a Google-authenticated user by email.
     * Throws if the user does not have ROLE_GOOGLE.
     *
     * @param email the user's email
     * @return the authenticated Google user
     * @throws NotFoundException if user not found
     * @throws ConflictException if user is not a Google user
     */
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

    /**
     * Retrieves a locally registered user by email.
     * Throws if the user does not have ROLE_USER.
     *
     * @param email the user's email
     * @return the authenticated local user
     * @throws NotFoundException if user not found
     * @throws ConflictException if user is not a local user
     */
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
