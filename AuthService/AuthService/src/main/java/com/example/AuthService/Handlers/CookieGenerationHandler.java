package com.example.AuthService.Handlers;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;


@Service
public class CookieGenerationHandler {

    public String createJwtCookie (String jwt) {


        return ResponseCookie.from("userDeskToken", jwt)
                .httpOnly(true)
                .secure(true) //  :: in production  make this true in development false
                .sameSite("None") // :: in production  make this None in development Lax
                 .path("/")                // ✅ allow full-path access
                .maxAge(Duration.ofDays(7))
                .build()
                .toString();
    }
}
