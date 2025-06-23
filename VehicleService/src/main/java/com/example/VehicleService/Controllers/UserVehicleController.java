package com.example.VehicleService.Controllers;


import com.example.VehicleService.Models.VehicleModel;
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
@RequestMapping("/v1/user/vehicle") // Base path for all vehicle-related endpoints
public class UserVehicleController {


    private final VehicleService vehicleService;

    public UserVehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }


    // :: localhost:8106/v1/user/vehicle - Fetch all vehicles
    @Transactional
    @GetMapping
    public ResponseEntity<ApiResponse<
            List<UtilRecords.VehicleApiData>>> getAllVehicles() {

        List<UtilRecords.VehicleApiData> vehicles = vehicleService.findAllVehicles();
        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Vehicles retrieved",
                        vehicles
                ));
    }




    // :: localhost:8106/v1/user/vehicle/get-by-vin
    // :: localhost:8106/v1/user/vehicle/get-by-vin?vin=ABC123XYZ
    @GetMapping("/get-by-vin")
    public ResponseEntity<ApiResponse<UtilRecords.VehicleApiData>> getVehicleByVin(
            @Valid @RequestParam String vin
    ) {

        UtilRecords.VehicleApiData vehicle = vehicleService.getVehicleByVin(vin);
        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Vehicles retrieved",
                        vehicle
                ));
    }

    // :: localhost:8106/v1/user/vehicle/handle-new-dispatch
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



