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
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/internal/auth")
public class UserInternalController {


    @Autowired
    private UserDetailService userDetailService;

    public record DispatchUpdateDto (String user,Long dispatchId , Double score) {}

    //  :: localhost:8103/internal/auth/dispatch/update-score

    @PostMapping("/dispatch/update-score")
    public ResponseEntity<ApiResponse<Void>>
    adminUpdateScore(@Valid DispatchUpdateDto updateDto ) {

        userDetailService.updateUserScore(updateDto.user(), updateDto.score(), updateDto.dispatchId());

        return ResponseEntity.ok(
                ApiResponse.ok(
                        200,
                        "Yeah wtv"
                ));}

}

