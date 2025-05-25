
package com.example.AuthService.Services;

import com.example.AuthService.Exceptions.ConflictException;
import com.example.AuthService.Exceptions.NotFoundException;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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



    @Transactional
    public UserModel findOrCreateFromOAuth(String email, String name, String imageUrl, String provider, boolean email_verified
    ) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserModel user = new UserModel();
                    user.setEmail(email);
                    user.setName(name);
                    user.setUserImage(imageUrl);
                    user.setProvider(provider);
                    user.setValidated(email_verified);
                    user.setRoles(List.of("ROLE_USER", "ROLE_GOOGLE"));
                    return userRepository.save(user);
                });
    }

    @Transactional
    public UserModel signUpFromOath(String email, String name, String imageUrl, String provider, boolean email_verified
    ) {
        UserModel user = new UserModel();
                    user.setEmail(email);
                    user.setName(name);
                    user.setUserImage(imageUrl);
                    user.setProvider(provider);
                    user.setValidated(email_verified);
                    user.setRoles(List.of("ROLE_USER", "ROLE_GOOGLE"));
                    return userRepository.save(user);}


    @Transactional
    public UserModel logInFromAuth(String email
    ) {

        Optional<UserModel> foundUser =  userRepository.findByEmail(email);

        if(foundUser.isEmpty()){
           throw new NotFoundException("Google user not found");
        }
            if(
                    !foundUser.get().getRoles().contains("ROLE_GOOGLE")
            ){
                throw new ConflictException("This is not a valid google user");
            }
        return foundUser.get();
    }
}
