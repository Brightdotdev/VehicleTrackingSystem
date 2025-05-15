package com.example.VehicleService.Services;


import com.example.VehicleService.Models.VehicleHealthAttributeModel;
import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Models.VehicleWildcardAttributeModel;
import com.example.VehicleService.Repositories.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VehicleHealthService {



    @Transactional
    public Map<String, Object> vehicleDispatchStatus(VehicleModel vehicle) {

        boolean canDispatch = true;
        double safetyScore = 0.00;

        Map<String, Object> safetyScoreResult = new HashMap<>();
        List<Map<String, Boolean>> wildCards = new ArrayList<>();
        List<Map<String, Double>> healthAttributes = new ArrayList<>();


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
        safetyScoreResult.put("canDispatch",canDispatch);
        safetyScoreResult.put("wildCards", wildCards);
        safetyScoreResult.put("healthAttributes", healthAttributes);

        return safetyScoreResult;
    }


}
