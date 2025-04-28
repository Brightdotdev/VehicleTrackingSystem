package com.example.DispatchService.controller;


import com.example.DispatchService.Config.UserHandler;
import com.example.DispatchService.Models.DispatchModel;
import com.example.DispatchService.Service.DispatchService;
import com.example.DispatchService.Utils.ApiResponse;
import com.example.DispatchService.Utils.UtilRecords;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dispatch")
public class DispatchController {


    @Autowired
    public DispatchService dispatchService;


    @Autowired
    public UserHandler userHandler;


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/approve-dispatch")
    public String approveDispatch() {
        return "Dispatch ooo";
    }




    @PostMapping("/create-dispatch")
    public ResponseEntity<ApiResponse<String>>createDispatch(@Valid UtilRecords
            .dispatchRequestBody dispatchRequest) {


       String vehicleMessage =   dispatchService.requestDispatchVehicle(dispatchRequest);



        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Dispatch request Success",
                        "Dispatch request Successfully created"
                ));
    }

    @GetMapping
    public List<DispatchModel> getAllDispatches(){
      return dispatchService.getAllDispatch();
    }


    @GetMapping
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // From JWT subject
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return ResponseEntity.ok(Map.of(
                "username", username,
                "roles", roles
        ));
    }

}
