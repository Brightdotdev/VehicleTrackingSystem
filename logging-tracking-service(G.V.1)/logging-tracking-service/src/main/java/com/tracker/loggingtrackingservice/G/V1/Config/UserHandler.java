package com.tracker.loggingtrackingservice.G.V1.Config;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("userHandlerService")
public class UserHandler {

    private String currentUser;
    private List<String> roles;

    public String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        this.currentUser = authentication.getName();
        return this.currentUser;}


    public List<String> getRoles() {
        return roles;
    }



    public UserHandler() {
    }

    public UserHandler(String currentUser, List<String> roles) {
        this.currentUser = currentUser;
        this.roles = roles;
    }
}
