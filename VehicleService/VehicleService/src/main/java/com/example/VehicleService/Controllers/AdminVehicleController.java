package com.example.VehicleService.Controllers;

import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Services.VehicleService;
import com.example.VehicleService.Utils.ApiResponse;
import com.example.VehicleService.Utils.UtilRecords;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/v1/admin/vehicle") // Base path for all vehicle-related endpoints
public class AdminVehicleController {

    private final VehicleService vehicleService;
    public AdminVehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }



    // :: localhost:8106/v1/admin/vehicle - Fetch all vehicles
    @GetMapping
    public ResponseEntity<ApiResponse<List<UtilRecords.VehicleApiData>>> getAllVehicles() {

        List<UtilRecords.VehicleApiData> vehicles = vehicleService.findAllVehicles();
        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Vehicles retrieved",
                        vehicles
                ));
    }

    // :: localhost:8106/v1/admin/vehicle/{vin} - Fetch vehicles by vin
    @GetMapping("/{vin}")
    public ResponseEntity<ApiResponse<VehicleModel>> getVehicleByVIN(@PathVariable String vin) {

        VehicleModel vehicle = vehicleService.findVehicleByIdentificationNumber(vin);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Vehicle retrieved by vin",
                        vehicle
                ));
    }

    // :: localhost:8106/v1/admin/vehicle - Save a new vehicle
    @PostMapping
    public ResponseEntity<ApiResponse<VehicleModel>> saveVehicle(@Valid @RequestBody UtilRecords.VehicleDTO vehicle) {
        VehicleModel savedVehicle = vehicleService.saveVehicle(vehicle);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Vehicle Saved successfully",
                        savedVehicle
                ));

    }



    // :: localhost:8106/v1/admin/vehicle/bad - Save a new vehicle
    @PostMapping("/bad")
    public ResponseEntity<ApiResponse<VehicleModel>> saveBadVehicle(@Valid @RequestBody UtilRecords.VehicleDTO vehicle) {
        VehicleModel savedVehicle = vehicleService.saveBadVehicle(vehicle);

        return ResponseEntity.ok(
                ApiResponse.success(
                        201,
                        "Vehicle Saved successfully",
                        savedVehicle
                ));

    }
}
