package com.example.AuthService.Controllers;


import com.example.AuthService.Config.JwtConfig;
import com.example.AuthService.Exceptions.AccessException;
import com.example.AuthService.Exceptions.ConflictException;
import com.example.AuthService.Exceptions.NotFoundException;
import com.example.AuthService.Handlers.CookieGenerationHandler;
import com.example.AuthService.Models.UserModel;
import com.example.AuthService.Services.AdminService;
import com.example.AuthService.Services.UserDetailService;
import com.example.AuthService.Utils.ApiResponse;
import com.example.AuthService.Utils.UtilRecords;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jdk.jshell.execution.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/v1/auth/admin")
public class AdminController {


    @Autowired
    private CookieGenerationHandler cookieHandler;
    @Autowired
    private UserDetailService userDetailService;

    @Autowired
    private AdminService adminService;

    private final JwtConfig jwtConfig;

    public AdminController(JwtConfig jwtConfig){
        this.jwtConfig = jwtConfig;
    }


    //  :: localhost:8103/v1/auth/admin/new-user/join-us
    @PostMapping("/new-user/join-us")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> signUpLocally(@Valid @RequestBody UtilRecords.AdminLocalSignUp request, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userDetailService.handleAdminLocalSignUp(request);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth(),userDatabaseSignIn.user().getName());
             String cookie = cookieHandler.createAdminCooke(jwt);



        response.addHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseSignIn.user().getName(),
                userDatabaseSignIn.user().getEmail(),
                userDatabaseSignIn.user().getRoles(),
                cookie,jwt);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "admin joined successfully",
                        clientResponse
                ));
    }


    //  :: localhost:8103/v1/auth/admin/new-user/google
    @PostMapping("/new-user/google")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> signUpGoogle(@Valid @RequestBody UtilRecords.AdminGoogleSignUp request, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userDetailService.handleOath2AdminSignUp(request);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth(),userDatabaseSignIn.user().getName());

        String cookie = cookieHandler.createAdminCooke(jwt);


        response.addHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseSignIn.user().getName(),
                userDatabaseSignIn.user().getEmail(),
                userDatabaseSignIn.user().getRoles(),
                cookie,jwt);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Google admin signed in successfully",
                        clientResponse
                ));
    }



    // admin google log in :: localhost:8103/v1/auth/admin/welcome-back/google

    @PostMapping("/welcome-back/google")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> googleLogIn(@Valid  @RequestBody UtilRecords.AdminGoogleLogIn adminLoginReq, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userDetailService.handleOath2AdminLogIn(adminLoginReq);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth(),userDatabaseSignIn.user().getName());

        String cookie = cookieHandler.createAdminCooke(jwt);


        response.addHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseSignIn.user().getName(),
                userDatabaseSignIn.user().getEmail(),
                userDatabaseSignIn.user().getRoles(),
                cookie,jwt);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Goggle admin logged in successfully",
                        clientResponse
                ));
    }




    //  Local log in :: localhost:8103/v1/auth/admin/welcome-back
    @PostMapping("/welcome-back")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> logInLocally(@Valid @RequestBody UtilRecords.AdminLocalLogin request, HttpServletResponse response) {


        UtilRecords.LoginServiceResponse userDatabaseLogin = userDetailService.handleAdminLogIn(request);

        String jwt = jwtConfig.generateToken(userDatabaseLogin.auth(),userDatabaseLogin.user().getName());
        String cookie = cookieHandler.createAdminCooke(jwt);

        response.addHeader(HttpHeaders.SET_COOKIE, cookie);


        response.addHeader(HttpHeaders.SET_COOKIE, cookie);
        UtilRecords.LogInClientResponse clientResponse = new UtilRecords.LogInClientResponse(userDatabaseLogin.user().getName(),
                userDatabaseLogin.user().getEmail(),
                userDatabaseLogin.user().getRoles(),
                cookie,jwt);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "admin retrieved successfully",
                        clientResponse
                ));
    }

    //  Local log out :: localhost:8103/v1/auth/admin/log-out
    @GetMapping("/log-out")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie expiredCookie = ResponseCookie.from("adminDeskCookie", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(0) // <--- delete cookie
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());
        return ResponseEntity.noContent().build();
    }

    //  validate admin cookie:: localhost:8103/v1/auth/admin/validate-cookie
    @GetMapping("/validate-cookie")
    public ResponseEntity<ApiResponse<Map<String, Object>>>
    validateJwtCookie(HttpServletRequest request) {

        String jwt = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("adminDeskCookie".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        boolean valid = jwt != null && jwtConfig.validateToken(jwt);

        if(!valid){
            throw new AccessException("Invalid jwt token and cookie");
        }




        String sender = jwtConfig.getClaims(jwt).get("sender", String.class);

        if(!Objects.equals(sender, jwtConfig.getJwt().getSender())){
            System.out.println(sender);
            System.out.println(jwtConfig.getJwt().getSender());
            throw new ConflictException("The sender doesn't match with the token");
        }


        Map<String, Object> response = new HashMap<>();

        String email = jwtConfig.extractUsername(jwt);


        Map<String, Object> user = new HashMap<>();
        UserModel adminData = adminService.findAdmin(email);
        user.put("email", email);
        user.put("picture", adminData.getUserImage());
        user.put("username", adminData.getName());

        user.put("licenceExp", adminData.getLicenseExpiry());
        user.put("joinedAt", adminData.getJoinedAt());

        user.put("userStatus", adminData.getUserStatus());
        user.put("licence", adminData.getLicenseKey());

        response.put("user", user);
        response.put("valid", true);


        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "Admin validated successfully",
                        response
                ));}

    public record adminKeyReq (String adminKey) {}
    //  validate admin cookie:: localhost:8103/v1/auth/admin/validate-key
    @PostMapping("/validate-key")
    public ResponseEntity<ApiResponse<Boolean>> validateKey(@Valid @NotNull @RequestBody adminKeyReq keyReq) {



        if (!keyReq.adminKey().equals(adminService.getAdminKey().toString())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(403, "Invalid key"));
        }

        return ResponseEntity.ok(
                ApiResponse.success(200, "Valid key", true)
        );
}










}

