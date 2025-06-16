package com.example.VehicleService.Repositories;

import com.example.VehicleService.Models.VehicleModel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface VehicleRepository extends JpaRepository<VehicleModel, Long> {




    VehicleModel findByVehicleIdentificationNumber(String vehicleIdentificationNumber);
}
