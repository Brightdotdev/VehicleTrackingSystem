package com.example.VehicleService.Services;


import com.example.VehicleService.Models.VehicleModel;
import com.example.VehicleService.Utils.UtilRecords;
import com.example.VehicleService.Utils.VehicleEnums;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class VehicleHealthService {



    public UtilRecords.SafetyScoreResult calculateSafetyScore(Map<String, Boolean> healthAttributes, Map<String, Boolean> wildcards) {

        double score = 100.0;
        double healthPenalty = 5.0;
        List<String> failedWildcards = new ArrayList<>();

        for (Map.Entry<String, Boolean> entry : wildcards.entrySet()) {
            if (!entry.getValue()) {
                failedWildcards.add(entry.getKey());
            }
        }

        // 2. Deduct penalties for health attributes
        for (Boolean value : healthAttributes.values()) {
            if (!value) {
                score -= healthPenalty;
            }
        }

        // 3. Clamp score to 0 minimum
        score = Math.max(score, 0);

        // 4. Return the score + list of failed wildcards
        return new UtilRecords.SafetyScoreResult(score, failedWildcards);
    }


    public void updateVehicleAfterHealthCheck(VehicleModel vehicle, UtilRecords.SafetyScoreResult result) {

        vehicle.setSafetyScore(result.safetyScore());

        if (!result.wildCardReasons().isEmpty()) {
            vehicle.setHealthStatus(VehicleEnums.VehicleHealthStatus.MAINTENANCE);
        } else {
            vehicle.setHealthStatus(VehicleEnums.VehicleHealthStatus.ACTIVE);
        }

}
}
