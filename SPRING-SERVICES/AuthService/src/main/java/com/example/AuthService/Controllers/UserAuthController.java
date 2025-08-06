package com.example.AuthService.Controllers;


import com.example.AuthService.Config.JwtConfig;
import com.example.AuthService.Exceptions.AccessException;
import com.example.AuthService.Exceptions.ConflictException;
import com.example.AuthService.Exceptions.NotFoundException;
import com.example.AuthService.Handlers.CookieGenerationHandler;
import com.example.AuthService.Models.UserModel;
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
import java.util.Objects;

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

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth(),userDatabaseSignIn.user().getName());

     String cookie = cookieHandler.createJwtCookie(jwt);


        response.addHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseSignIn.user().getName(),
                userDatabaseSignIn.user().getEmail(),
                userDatabaseSignIn.user().getRoles(),
                cookie,jwt);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "User saved successfully",
                        clientResponse
                ));
    }

    //  :: localhost:8103/v1/auth/sign-in/user/google
    @PostMapping("/sign-in/google")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> signUpGoogle(@Valid @RequestBody UtilRecords.UserGoogleSignUp request, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userDetailService.handleOath2UserSignIn(request);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth(),userDatabaseSignIn.user().getName());

        String cookie = cookieHandler.createJwtCookie(jwt);


        response.addHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseSignIn.user().getName(),
                userDatabaseSignIn.user().getEmail(),
                userDatabaseSignIn.user().getRoles(),
                cookie,jwt);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "User saved successfully",
                        clientResponse
                        ));
    }

    // google log in :: localhost:8103/v1/auth/user/welcome-back/google
    @PostMapping("/welcome-back/google")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> googleLogIn(@Valid @RequestBody @NotNull String request, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userDetailService.handleUserOath2UserLogIn(request);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth(), userDatabaseSignIn.user().getName());

        String cookie = cookieHandler.createJwtCookie(jwt);


        response.addHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseSignIn.user().getName(),
                userDatabaseSignIn.user().getEmail(),
                userDatabaseSignIn.user().getRoles(),
                cookie,jwt);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "User logged in successfully",
                        clientResponse
                        ));
    }




    //  Local log in :: localhost:8103/v1/auth/user/welcome-back
    @PostMapping("/welcome-back")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> logInLocally(@Valid @RequestBody UtilRecords.LocalLogin request, HttpServletResponse response) {


        UtilRecords.LoginServiceResponse userDatabaseLogin = userDetailService.handleUserLocalLogIn(request);

        String jwt = jwtConfig.generateToken(userDatabaseLogin.auth(),userDatabaseLogin.user().getName());
        String cookie = cookieHandler.createJwtCookie(jwt);

        response.addHeader(HttpHeaders.SET_COOKIE, cookie);



      response.addHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseLogin.user().getName(),
                userDatabaseLogin.user().getEmail(),
                userDatabaseLogin.user().getRoles(),
                cookie,jwt);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
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

        response.addHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());
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

        boolean valid = jwt != null && jwtConfig.validateToken(jwt);

        if(!valid){
            throw new AccessException("Invalid jwt token and cookie");}


        String sender = jwtConfig.getClaims(jwt).get("sender", String.class);

        if(!Objects.equals(sender, jwtConfig.getJwt().getSender())){
            System.out.println(sender);
            System.out.println(jwtConfig.getJwt().getSender());
            throw new ConflictException("The sender doesn't match with the token");
        }


        Map<String, Object> response = new HashMap<>();
        String email = jwtConfig.extractUsername(jwt);

        UserModel user = userDetailService.getUserData(email);

        if(user == null){
            throw new NotFoundException("No User Found with tha credentials");
        }


        String username = jwtConfig.getClaims(jwt).get("name", String.class);
        Map<String, Object> userResponse = new HashMap<>();

        userResponse.put("email", email);





        userResponse.put("username", username );


        response.put("user", userResponse);


        response.put("valid", true);


        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "User credentials validated",
                        response
                ));}


    //  validate user cookie:: localhost:8103/v1/auth/user/get-me

    @GetMapping("/get-me")
    public ResponseEntity<ApiResponse<Map<String, Object>>>
    getUserData(HttpServletRequest request) {

        String jwt = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("userDeskToken".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        boolean valid = jwt != null && jwtConfig.validateToken(jwt);

        if(!valid){
            throw new AccessException("Invalid jwt token and cookie");}


        String sender = jwtConfig.getClaims(jwt).get("sender", String.class);

        if(!Objects.equals(sender, jwtConfig.getJwt().getSender())){
            System.out.println(sender);
            System.out.println(jwtConfig.getJwt().getSender());
            throw new ConflictException("The sender doesn't match with the token");
        }

        String email = jwtConfig.extractUsername(jwt);
        UserModel user = userDetailService.getUserData(email);

        if(user == null){
            throw new NotFoundException("No User Found with tha credentials");
        }

        Map<String, Object> response = new HashMap<>();


        Map<String, Object> useResponse = new HashMap<>();
        useResponse.put("email", email);
        useResponse.put("username", user.getName());
        useResponse.put("licence", user.getLicenseKey());
        useResponse.put("image", user.getUserImage());
        useResponse.put("dispatchPoints", user.getDispatchPoints().getLast());
        useResponse.put("userStatus", user.getUserStatus());
        useResponse.put("licenceExp", user.getLicenseExpiry());
        useResponse.put("joinedAt", user.getJoinedAt());

        response.put("userData", useResponse);
        response.put("valid", true);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "User credentials retrieved",
                        response
                ));}



}

