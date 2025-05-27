package com.example.AuthService.Controllers;


import com.example.AuthService.Config.JwtConfig;
import com.example.AuthService.Exceptions.AccessException;
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

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth());
        System.out.println("---- jwt token -----");
        System.out.println(jwt);
        String cookie = cookieHandler.createAdminCooke(jwt);


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


    //  :: localhost:8103/v1/auth/admin/new-user/google
    @PostMapping("/new-user/google")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> signUpGoogle(@Valid @RequestBody UtilRecords.AdminGoogleSignUp request, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userDetailService.handleOath2AdminSignUp(request);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth());

        String cookie = cookieHandler.createAdminCooke(jwt);
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



    // admin google log in :: localhost:8103/v1/auth/admin/welcome-back/google

    @PostMapping("/welcome-back/google")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> googleLogIn(@Valid  @RequestBody UtilRecords.AdminGoogleLogIn adminLoginReq, HttpServletResponse response) {

        UtilRecords.LoginServiceResponse userDatabaseSignIn = userDetailService.handleOath2AdminLogIn(adminLoginReq);

        String jwt = jwtConfig.generateToken(userDatabaseSignIn.auth());

        String cookie = cookieHandler.createAdminCooke(jwt);
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




    //  Local log in :: localhost:8103/v1/auth/admin/welcome-back
    @PostMapping("/welcome-back")
    public ResponseEntity<ApiResponse<UtilRecords.LogInClientResponse>> logInLocally(@Valid @RequestBody UtilRecords.AdminLocalLogin request, HttpServletResponse response) {


        UtilRecords.LoginServiceResponse userDatabaseLogin = userDetailService.handleAdminLogIn(request);

        String jwt = jwtConfig.generateToken(userDatabaseLogin.auth());
        String cookie = cookieHandler.createAdminCooke(jwt);

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

        response.setHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());
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

        Boolean valid = jwt != null && jwtConfig.validateToken(jwt);

        if(!valid){
            throw new AccessException("Invalid jwt token and cookie");
        }

        Map<String, Object> response = new HashMap<>();

        String username = jwtConfig.extractUsername(jwt);
        List<String> roles = jwtConfig.getClaims(jwt).get("roles", List.class);

        Map<String, Object> user = new HashMap<>();
        UserModel adminData = adminService.findAdmin(username);
        user.put("email", username);
        user.put("roles", roles);
        user.put("picture", adminData.getUserImage());
        user.put("username", adminData.getName());

        response.put("user", user);
        response.put("valid", valid);





        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "User retrieved successfully",
                        response
                ));}

    public record adminKeyReq (String adminKey) {}
    //  validate admin cookie:: localhost:8103/v1/auth/admin/validate-key
    @PostMapping("/validate-key")
    public ResponseEntity<ApiResponse<Boolean>> validateKey(@Valid @NotNull @RequestBody adminKeyReq keyReq) {


        System.out.println(keyReq);
        System.out.println(adminService.getAdminKey());
        System.out.println(adminService.getAdminKey().toString());


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

