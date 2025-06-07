package com.example.AuthService.Controllers;


import com.example.AuthService.Config.JwtConfig;
import com.example.AuthService.Exceptions.AccessException;
import com.example.AuthService.Handlers.CookieGenerationHandler;
import com.example.AuthService.Services.UserDetailService;
import com.example.AuthService.Utils.ApiResponse;
import com.example.AuthService.Utils.UtilRecords;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/auth/user")
public class UserAuthController {


    @Autowired
    private CookieGenerationHandler cookieHandler;
    @Autowired
    private UserDetailService userDetailService;

    private final JwtConfig jwtConfig;

    public UserAuthController(JwtConfig jwtConfig){
        this.jwtConfig = jwtConfig;
    }

    
    //  :: localhost:8103/v1/auth/user/new-user/join-us
    @PostMapping("/new-user/join-us")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> signUpLocally(@Valid @RequestBody UtilRecords.UserLocalSignUp request, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userDetailService.handleUserSignUp(request);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth(), "");
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

    //  :: localhost:8103/v1/auth/user/new-user/google
    @PostMapping("/new-user/google")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> signUpGoogle(@Valid @RequestBody UtilRecords.UserGoogleSignUp request, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userDetailService.handleOath2UserSignIn(request);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth(),request.picture());

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
                        "User signed in successfully",
                        clientResponse
                        ));
    }

    // google log in :: localhost:8103/v1/auth/user/welcome-back/google
    @PostMapping("/welcome-back/google")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> googleLogIn(@Valid @RequestBody @NotNull String request, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userDetailService.handleUserOath2UserLogIn(request);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth(),"");

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




    //  Local log in :: localhost:8103/v1/auth/user/welcome-back
    @PostMapping("/welcome-back")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> logInLocally(@Valid @RequestBody UtilRecords.LocalLogin request, HttpServletResponse response) {


        UtilRecords.LoginServiceResponse userDatabaseLogin = userDetailService.handleUserLocalLogIn(request);

        String jwt = jwtConfig.generateToken(userDatabaseLogin.auth(),"");
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

    //  Local log out :: localhost:8103/v1/auth/user/log-out
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

    //  validate user cookie:: localhost:8103/v1/auth/user/validate-cookie
    @GetMapping("/validate-cookie")
    public ResponseEntity<ApiResponse<Map<String, Object>>>
    validateJwtCookie(HttpServletRequest request) {

        String jwt = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("userDeskToken".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        Boolean valid = jwt != null && jwtConfig.validateToken(jwt);

        if(!valid){
            throw new AccessException("Invalid jwt token and cookie");
        }

        Map<String, Object> response = new HashMap<>();

        String username = jwtConfig.extractUsername(jwt);
        List<String> roles = jwtConfig.getClaims(jwt).get("roles", List.class);

        Map<String, Object> user = new HashMap<>();
        user.put("username", username);
        user.put("roles", roles);
        response.put("user", user);
        response.put("valid", valid);





        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "User retrieved successfully",
                        response
                ));}



}

