package com.example.DispatchService.Controller;


import com.example.DispatchService.Config.UserHandler;
import com.example.DispatchService.Models.DispatchModel;
import com.example.DispatchService.Service.AdminDispatchService;
import com.example.DispatchService.Service.UserDispatchService;
import com.example.DispatchService.Utils.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/v1/admin/dispatch")
public class AdminDispatchController {
    @Autowired
    public AdminDispatchService adminDispatchService;


    @Autowired
    public UserDispatchService userDispatchService;

    @Autowired
    public UserHandler userHandler;


    /** Endpoint for admins to validate (approve) a dispatch **/
    // :: localhost:8105/v1/admin/dispatch/validate

    @PutMapping("/validate")
    public ResponseEntity<ApiResponse<DispatchModel>> validateDispatch(
            @RequestParam Long dispatchId) {
        System.out.println(dispatchId);
        DispatchModel model = adminDispatchService.validateDispatch(userHandler.getCurrentUser(), userHandler.getRoles(), dispatchId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Dispatch validation Success",
                        model
                ));
    }

    /** Endpoint for admins to cancel a dispatch **/

    // :: localhost:8105/v1/admin/dispatch/admin-cancel
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin-cancel")
    public ResponseEntity<ApiResponse<DispatchModel>> adminCancelDispatch(
            @RequestParam Long dispatchId,
            @RequestBody String dispatchCancelReason) {

        DispatchModel dispatchModel =  adminDispatchService.cancelDispatch(userHandler.getCurrentUser(), userHandler.getRoles(), dispatchId, dispatchCancelReason);


        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Dispatch cancel Success",
                        dispatchModel
                ));
    }

    /** Endpoint to revalidate (recalculate) all dispatches **/

    // :: localhost:8105/v1/admin/dispatch/get-all


    @GetMapping("/get-all")
    public
    ResponseEntity<ApiResponse<List<DispatchModel>>>
    revalidateAllDispatch() {
        List<DispatchModel> dispatchMetadata =  adminDispatchService.revalidateAllActiveDispatch();

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Fetched dispatches",
                        dispatchMetadata
                ));
    }





    // :: localhost:8105/v1/admin/dispatch/get-dispatch-by-id-and-vin
    @GetMapping("/get-dispatch-by-id-and-vin")
    public
    ResponseEntity<ApiResponse<DispatchModel>>
    revalidateSingleDispatch(@Valid @RequestParam Long dispatchId,
                            @Valid @RequestParam String vehicleId) {

        DispatchModel metadata = adminDispatchService.revalidateDispatchByIdAndVehicleId(dispatchId,vehicleId );

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Dispatch cancel Success",
                        metadata
                ));}

    // :: localhost:8105/v1/admin/dispatch/get-vehicle-history
    @GetMapping("/get-vehicle-history")
    public
    ResponseEntity<ApiResponse<List<DispatchModel>>>
    getVehicleDispatchHistory(@Valid @RequestParam String vehicleVin) {

        List<DispatchModel> vehicleHistory = adminDispatchService.getVehicleHistory(vehicleVin);
        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Dispatch cancel Success",
                        vehicleHistory
                ));
    }




    @GetMapping
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // From JWT subject
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return ResponseEntity.ok(Map.of(
                "username", username,
                "roles", roles
        ));
    }



}
