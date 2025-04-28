package com.example.DispatchService.Service;


import com.example.DispatchService.Models.DispatchModel;
import com.example.DispatchService.Repositories.DispatchRepository;
import com.example.DispatchService.Utils.UtilRecords;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DispatchService {

    private final DispatchRepository dispatchRepository;


    public DispatchService(DispatchRepository dispatchRepository) {
        this.dispatchRepository = dispatchRepository;
    }



    public String requestDispatchVehicle(UtilRecords.dispatchRequestBody requestBody){

        dispatchRepository.isVehicleDispatched();


        return "djdjd";
    }


    public List<DispatchModel> getAllDispatch(){
     return   dispatchRepository.findAll();
    }
}
