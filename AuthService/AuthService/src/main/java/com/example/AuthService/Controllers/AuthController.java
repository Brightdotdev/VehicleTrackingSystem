package com.example.AuthService.Controllers;


import com.example.AuthService.Config.JwtConfig;
import com.example.AuthService.Handlers.CookieGenerationHandler;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Services.CustomUserDetailsService;
import com.example.AuthService.Utils.ApiResponse;
import com.example.AuthService.Utils.UtilRecords;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {


    @Autowired
    CookieGenerationHandler cookieHandler;
    @Autowired
    private CustomUserDetailsService userService;

    private final JwtConfig jwtConfig;

    public AuthController(JwtConfig jwtConfig){
        this.jwtConfig = jwtConfig;
    }

    
    //  :: localhost:8103/v1/auth/new-user/join-us
    @PostMapping("/new-user/join-us")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> signUpLocally(@Valid @RequestBody UtilRecords.UserLocalSignUp request, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userService.handleLocalSignUp(request);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth());
        System.out.println("---- jwt token -----");
        System.out.println(jwt);
        String cookie = cookieHandler.createJwtCookie(jwt);


        System.out.println("Set-Cookie Header: " + cookie);

        response.setHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseSignIn.user().getName(),
                userDatabaseSignIn.user().getEmail(),
                userDatabaseSignIn.user().getRoles(),
                cookie);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "User retrieved successfully",
                        clientResponse
                ));
    }


    //  :: localhost:8103/v1/auth/new-user/google
    @PostMapping("/new-user/google")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> signUpGoogle(@Valid @RequestBody UtilRecords.UserGoogleSignUp request, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userService.handleOath2UserSignIn(request);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth());

        String cookie = cookieHandler.createJwtCookie(jwt);
        System.out.println("---- jwt cookie -----");
        System.out.println(jwt);

        response.setHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseSignIn.user().getName(),
                userDatabaseSignIn.user().getEmail(),
                userDatabaseSignIn.user().getRoles(),
                cookie);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "User retrieved successfully",
                        clientResponse
                        ));
    }




    //  Local log in :: localhost:8103/v1/auth/welcome-back
    @PostMapping("/welcome-back")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> logInLocally(@Valid @RequestBody UtilRecords.LocalLogin request, HttpServletResponse response) {


        UtilRecords.LoginServiceResponse userDatabaseLogin = userService.handleLocalLogIn(request);

        String jwt = jwtConfig.generateToken(userDatabaseLogin.auth());
        String cookie = cookieHandler.createJwtCookie(jwt);

        response.setHeader(HttpHeaders.SET_COOKIE, cookie);


        System.out.println("---- jwt cookie -----");
        System.out.println(jwt);
        response.setHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseLogin.user().getName(),
                userDatabaseLogin.user().getEmail(),
                userDatabaseLogin.user().getRoles(),
                cookie);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "User retrieved successfully",
                        clientResponse
                ));
    }

    //  Local log in :: localhost:8103/v1/auth/log-out
    @GetMapping("/log-out")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie expiredCookie = ResponseCookie.from("userDeskToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(0) // <--- delete cookie
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());
        return ResponseEntity.noContent().build();
    }

}

