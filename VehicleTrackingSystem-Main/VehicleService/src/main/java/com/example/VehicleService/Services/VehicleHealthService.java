package com.example.VehicleService.Services;


import com.example.VehicleService.Models.VehicleHealthAttributeModel;
import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Models.VehicleWildcardAttributeModel;
import com.example.VehicleService.Repositories.VehicleRepository;
import com.example.VehicleService.Utils.UtilRecords;
import com.example.VehicleService.Utils.VehicleEnums;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VehicleHealthService {



    @Transactional
    public Map<String, Object> vehicleDispatchStatus(VehicleModel vehicle, UtilRecords.dispatchRequestBodyDTO dispatchEvent) {

        boolean canDispatch = true;
        double safetyScore = 0.00;

        Map<String, Object> safetyScoreResult = new HashMap<>();
        List<Map<String, Boolean>> wildCards = new ArrayList<>();
        List<Map<String, Double>> healthAttributes = new ArrayList<>();
          Map<String, Object> logicComplains = new HashMap<>();

        if(dispatchEvent.vehicleStatus() == VehicleEnums.VehicleStatus.CLASSIFIED
        && vehicle.getVehicleStatus() != VehicleEnums.VehicleStatus.CLASSIFIED
        ){
            logicComplains.put("invalidRequest", "Classified requests are only for classified vehicles");
            canDispatch = false;
        } else if(dispatchEvent.vehicleStatus() == VehicleEnums.VehicleStatus.TRANSPORT
                && vehicle.getVehicleStatus() == VehicleEnums.VehicleStatus.CLASSIFIED
        ){
            logicComplains.put("invalidRequest", "Classified Vehicles Cannot be used for Transport");
            canDispatch = false;
        }



        for (VehicleHealthAttributeModel attribute : vehicle.getHealthAttributes()) {
            double score = attribute.getScore();
            healthAttributes.add(Map.of(
                    String.valueOf(attribute.getAttributeName()),
                    score));
            safetyScore += score;}

        for (VehicleWildcardAttributeModel wildcard : vehicle.getWildcardAttributes()) {

            if (wildcard.getWildcardValue()){

                wildCards.add(Map.of(
                String.valueOf(wildcard.getWildcardKey()),
                wildcard.getWildcardValue()));

                canDispatch = false;
            }}

        safetyScoreResult.put("safetyScore",  safetyScore);
        safetyScoreResult.put("vehicleImage",  vehicle.getVehicleImages());
        safetyScoreResult.put("canDispatch",canDispatch);
        safetyScoreResult.put("wildCards", wildCards);
        safetyScoreResult.put("healthAttributes", healthAttributes);
        safetyScoreResult.put("logicErrors", logicComplains);
        return safetyScoreResult;
    }


}
