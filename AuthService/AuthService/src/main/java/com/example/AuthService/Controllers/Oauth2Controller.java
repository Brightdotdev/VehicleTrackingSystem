package com.example.AuthService.Controllers;

import com.example.AuthService.Services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/oauth")
public class Oauth2Controller {

    private final AuthService authService;

    public Oauth2Controller(AuthService authService) {
        this.authService = authService;
    }


    public record GoogleLoginRequest (String idToken) { }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        String jwt = authService.handleGoogleLogin(request.idToken());
        return ResponseEntity.ok().body(Map.of("token", jwt));
    }
}