
package com.example.AuthService.Services;

import com.example.AuthService.Exceptions.NotFoundException;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public UserModel findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
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


    // Add @Transactional to manage database transactions automatically
    @Transactional
    public UserModel findOrCreateFromOAuth(String email, String name, String imageUrl, String provider, boolean email_verified
    ) {
        // Try to find the user by email
        return userRepository.findByEmail(email)
                // If the user is not found, create and save a new one
                .orElseGet(() -> {
                    UserModel user = new UserModel();
                    user.setEmail(email);
                    user.setName(name);
                    user.setUserImage(imageUrl);
                    user.setProvider(provider);
                    user.setValidated(email_verified);
                    user.setRoles(List.of("ROLE_USER"));
                    return userRepository.save(user);
                });
    }

}
