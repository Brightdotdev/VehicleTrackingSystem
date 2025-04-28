package com.example.DispatchService.Repositories;

import com.example.DispatchService.Models.DispatchModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DispatchRepository extends JpaRepository<DispatchModel, Integer> {

}
