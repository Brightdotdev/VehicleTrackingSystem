package com.example.VehicleService.Controllers;

import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Services.VehicleService;
import com.example.VehicleService.Utils.ApiResponse;
import com.example.VehicleService.Utils.UtilRecords;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequestMapping("/v1/admin/vehicle")
public class AdminVehicleController {

    private final VehicleService vehicleService;

    public AdminVehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // GET /v1/admin/vehicle - Fetch all vehicles
    @GetMapping
    public ResponseEntity<ApiResponse<List<UtilRecords.VehicleApiData>>> getAllVehicles() {
        List<UtilRecords.VehicleApiData> vehicles = vehicleService.findAllVehicles();
        return ResponseEntity.ok(ApiResponse.success(200, "Vehicles retrieved", vehicles));
    }

    // GET /v1/admin/vehicle/{vin} - Fetch vehicle by VIN
    @GetMapping("/{vin}")
    public ResponseEntity<ApiResponse<UtilRecords.VehicleApiData>> getVehicleByVIN(@PathVariable String vin) {
        UtilRecords.VehicleApiData vehicle = vehicleService.getVehicleByVin(vin);
        return ResponseEntity.ok(ApiResponse.success(200, "Vehicle retrieved by VIN", vehicle));
    }

    // POST /v1/admin/vehicle/new - Save a new vehicle
    @PostMapping("/new")
    public ResponseEntity<ApiResponse<VehicleModel>> saveVehicle(@Valid @RequestBody UtilRecords.VehicleDTO vehicle) {
        VehicleModel savedVehicle = vehicleService.saveVehicle(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(201, "Vehicle saved successfully", savedVehicle));
    }

    // POST /v1/admin/vehicle/new/bad - Save a bad vehicle
    @PostMapping("/new/bad")
    public ResponseEntity<ApiResponse<VehicleModel>> saveBadVehicle(@Valid @RequestBody UtilRecords.VehicleDTO vehicle) {
        VehicleModel savedVehicle = vehicleService.saveBadVehicle(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(201, "Bad vehicle saved successfully", savedVehicle));
    }

    // PUT /v1/admin/vehicle/{vin}/maintenance - Mark vehicle for maintenance
    @PutMapping("/{vin}/maintenance")
    public ResponseEntity<ApiResponse<VehicleModel>> setVehicleInMaintenance(@PathVariable String vin) {
        VehicleModel maintainedVehicle = vehicleService.markVehicleForMaintenance(vin);
        return ResponseEntity.ok(ApiResponse.success(200, "Vehicle marked for maintenance", maintainedVehicle));
    }

    // GET /v1/admin/vehicle/locations - Get all vehicles location
    @GetMapping("/locations")
    public ResponseEntity<ApiResponse<List<UtilRecords.LatitudeLongitude>>> getVehiclesLocation() {
        List<UtilRecords.LatitudeLongitude> locations = vehicleService.getAllVehiclesLocation();
        return ResponseEntity.ok(ApiResponse.success(200, "Vehicle locations retrieved", locations));
    }

    // GET /v1/admin/vehicle/{vin}/dispatch-history - Get dispatch history
    @GetMapping("/{vin}/dispatch-history")
    public ResponseEntity<ApiResponse<List<Long>>> getVehicleHistory(@PathVariable String vin) {
        List<Long> vehicleHistory = vehicleService.getVehicleDispatchHistory(vin);
        return ResponseEntity.ok(ApiResponse.success(200, "Vehicle dispatch history retrieved", vehicleHistory));
    }
}
