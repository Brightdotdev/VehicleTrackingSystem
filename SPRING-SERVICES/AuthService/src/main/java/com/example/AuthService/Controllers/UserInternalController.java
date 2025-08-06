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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(UserInternalController.class);

    @PostMapping("/dispatch/update-score")
    public ResponseEntity<ApiResponse<Void>> adminUpdateScore(@Valid @RequestBody DispatchUpdateDto updateDto) {
        // Log incoming request
        logger.info("Received score update request: user={}, score={}, dispatchId={}",
                updateDto.user(), updateDto.score(), updateDto.dispatchId());

        // Delegate to service
        userDetailService.updateUserScore(updateDto.user(), updateDto.score(), updateDto.dispatchId());

        // Log success
        logger.info("Score updated successfully for user: {}", updateDto.user());

        return ResponseEntity.ok(
                ApiResponse.ok(200, "Yeah wtv")
        );
    }


}

