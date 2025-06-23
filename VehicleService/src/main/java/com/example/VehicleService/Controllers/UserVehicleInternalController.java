package com.example.VehicleService.Controllers;


import com.example.VehicleService.Services.VehicleService;
import com.example.VehicleService.Utils.ApiResponse;
import com.example.VehicleService.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/internal/user/vehicle") // Base path for all vehicle-related endpoints
public class UserVehicleInternalController {


    private final VehicleService vehicleService;

    public UserVehicleInternalController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }



    // :: localhost:8106/internal/user/vehicle/handle-new-dispatch
    @PostMapping("/handle-new-dispatch")
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleCreateDispatch(
            @Valid @RequestBody UtilRecords.dispatchRequestBodyDTO dispatchEvent
    ) {

        Map<String, Object> vehicle = vehicleService.handleDispatchToVehicle(dispatchEvent);
        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Vehicles retrieved",
                        vehicle
                ));
    }







}



