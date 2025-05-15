package com.example.DispatchService.Repositories;

import com.example.DispatchService.Models.DispatchModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DispatchRepository extends JpaRepository<DispatchModel, Long> {



    DispatchModel findByDispatchRequesterAndDispatchId(String user, Long dispatchId);

    List<DispatchModel> findByDispatchVehicleId(String findByDispatchVehicleId);

    List<DispatchModel> findAllByDispatchRequester(String user);

    DispatchModel findByDispatchId(Long dispatchId);

    DispatchModel findByDispatchIdAndDispatchRequester(Long dispatchId, String dispatchRequester);


    List<DispatchModel> findAllByDispatchIdAndDispatchRequester(Long dispatchId, String dispatchRequester);

}
