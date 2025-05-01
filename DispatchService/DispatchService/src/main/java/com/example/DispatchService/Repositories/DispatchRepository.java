package com.example.DispatchService.Repositories;

import com.example.DispatchService.Models.DispatchModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DispatchRepository extends JpaRepository<DispatchModel, Integer> {



    DispatchModel findByDispatchRequesterAndDispatchId(String user, int dispatchId);

    List<DispatchModel> findByDispatchVehicleId(String findByDispatchVehicleId);

    List<DispatchModel> findAllByDispatchRequester(String user);

    DispatchModel findByDispatchId(int dispatchId);

    DispatchModel findByDispatchIdAndDispatchRequester(int dispatchId, String dispatchRequester);


    List<DispatchModel> findAllByDispatchIdAndDispatchRequester(int dispatchId, String dispatchRequester);

}
