package com.tracker.loggingtrackingservice.G.V1.Controllers;


import com.tracker.loggingtrackingservice.G.V1.Services.UserHandlerService;
import com.tracker.loggingtrackingservice.G.V1.Utils.ApiResponse;
import com.tracker.loggingtrackingservice.G.V1.Utils.UtilRecords;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/internal")
public class LoggingInternalController {


    private final UserHandlerService userHandlerService;




    public LoggingInternalController(UserHandlerService userHandlerService) {
        this.userHandlerService = userHandlerService;
    }


    @PostMapping("/admin/create")
    public ResponseEntity<ApiResponse<Map<String, Object> >> createAdmin(@RequestBody UtilRecords.adminCreatedRequestBodyDto requestBody) {
        Map<String, Object> result = userHandlerService.createIfNotExists(requestBody);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "User synced successfully",
                        result
                ));
    }
}
