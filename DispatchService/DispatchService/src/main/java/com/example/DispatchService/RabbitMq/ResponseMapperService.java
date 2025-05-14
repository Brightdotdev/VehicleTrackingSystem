package com.example.DispatchService.RabbitMq;


import com.example.DispatchService.Utils.UtilRecords;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ResponseMapperService {







    public UtilRecords.DispatchResponseDTO dispatchResponseMapper (Map<String, Object> dispatchResponse){
        if (dispatchResponse == null) {
            throw new IllegalArgumentException("Invalid response format");
        }

        List<Map<String, Boolean>> wildCards = (List<Map<String, Boolean>>) dispatchResponse.getOrDefault("wildCards", new ArrayList<>());

        List<Map<String, Double>> healthAttributes = (List<Map<String, Double>>) dispatchResponse.getOrDefault("healthAttributes", new ArrayList<>());

        double safetyScore = dispatchResponse.get("safetyScore") instanceof Number
                ? ((Number) dispatchResponse.get("safetyScore")).doubleValue()
                : 0.0;

        boolean canDispatch = dispatchResponse.get("canDispatch") instanceof Boolean && (Boolean) dispatchResponse.get("canDispatch");

        // Return a new DTO instance
        return new UtilRecords.DispatchResponseDTO(wildCards, safetyScore, healthAttributes, canDispatch);
    }


}
