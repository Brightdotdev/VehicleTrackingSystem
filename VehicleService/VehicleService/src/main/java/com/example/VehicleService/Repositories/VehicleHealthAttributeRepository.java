package com.example.VehicleService.Repositories;

import com.example.VehicleService.Models.VehicleHealthAttributeModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleHealthAttributeRepository  extends JpaRepository<VehicleHealthAttributeModel, Long> {

}
