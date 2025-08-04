package com.example.DispatchService.Config;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("userHandlerService")
public class UserHandler {

    public String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }


    public List<String> getRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
    }


    // Get the user's image from the custom JWT claim set in the authentication details
    public String getUserImage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // The details should be a Map<String, Object> as set in your filter
        if (authentication.getDetails() instanceof Map<?, ?> detailsMap) {
            Object image = detailsMap.get("userImage");
            return image != null ? image.toString() : null;
        }

        return null;
    }

}
