package com.example.DispatchService.Controller;


import com.example.DispatchService.Config.UserHandler;
import com.example.DispatchService.Models.DispatchModel;
import com.example.DispatchService.Service.UserDispatchService;
import com.example.DispatchService.Utils.ApiResponse;
import com.example.DispatchService.Utils.UtilRecords;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/user/dispatch")
public class UserDispatchController {

    @Autowired
    public UserDispatchService userDispatchService;

    @Autowired
    public UserHandler userHandler;


    /** Endpoint for users to request a dispatch **/

    // :: localhost:8105/v1/user/dispatch/request-dispatch
    @PostMapping("/request-dispatch")
    public
    ResponseEntity<ApiResponse<
   // UtilRecords.DispatchResponseDTO
     DispatchModel
            >>
    requestDispatch(
    @RequestBody UtilRecords.dispatchRequestBody requestBody) {

    //  UtilRecords.DispatchResponseDTO
        DispatchModel  dispatchResponse =  userDispatchService.requestVehicleDispatch(requestBody, userHandler.getCurrentUser(), userHandler.getRoles());

        if (dispatchResponse == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(
                            403,
                            "Your request couldn't be processed"
                    ));
        }

        // If the model is not null, return success with the dispatch info
        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Dispatch request success",
                        dispatchResponse
                )
        );
    }


    /** Endpoint for a user to cancel their own dispatch **/

    // :: localhost:8105/v1/user/dispatch/user-cancel
    @PutMapping("/user-cancel")
    public ResponseEntity<ApiResponse<DispatchModel>> userCancelDispatch(@RequestParam Long dispatchId) {


       DispatchModel dispatchModel =  userDispatchService.userCancelingDispatch(userHandler.getCurrentUser(), userHandler.getRoles(), dispatchId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Dispatch cancel Success",
                        dispatchModel
                ));
    }

    /** Endpoint to fetch all dispatches for a specific user **/

    // :: localhost:8105/v1/user/dispatch/revalidate-me

    @GetMapping("/revalidate-me")
    public ResponseEntity<ApiResponse<List<DispatchModel>>> getAllMyDispatches() {


        List<DispatchModel> myDispatchModels = userDispatchService.revalidateMyDispatches(userHandler.getCurrentUser());


        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Dispatch cancel Success",
                        myDispatchModels
                ));
    }

}
