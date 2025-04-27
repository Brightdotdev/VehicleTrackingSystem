package com.example.AuthService.Services;

import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Repositoies.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service("userDetailsService")
public class CustomUserDetailsService implements UserDetailsService {


    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserModel user = (UserModel) userRepository.findByUsername(username);

        return (UserDetails) ResponseEntity.ok(user);
    }

    public UserModel findOrCreateUser(String email, Object name, String google) {

        return (UserModel) loadUserByUsername(email);


    }
}
