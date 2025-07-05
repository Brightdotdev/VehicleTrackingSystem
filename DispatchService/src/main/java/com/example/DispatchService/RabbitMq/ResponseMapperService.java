package com.example.DispatchService.RabbitMq;


import com.example.DispatchService.Utils.UtilRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ResponseMapperService {





        private final Logger logger = LoggerFactory.getLogger(ResponseMapperService.class);

        public Map<String, Object> dispatchMapper(Object response) {
            if (!(response instanceof Map<?, ?> responseMap)) {
                throw new IllegalArgumentException("Invalid response format: not a Map");
            }

            Object dataObj = responseMap.get("data");

            if (dataObj == null) {
                logger.warn("Missing 'data' field in response: {}", responseMap);
                throw new IllegalArgumentException("Missing 'data' in response");
            }

            if (!(dataObj instanceof Map<?, ?> dataMap)) {
                logger.error("Expected 'data' to be a Map but got: {}", dataObj.getClass());
                throw new IllegalArgumentException("'data' is not a Map");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> result = (Map<String, Object>) dataObj;
            return result;
        }

    public UtilRecords.DispatchResponseDTO dispatchResponseMapper (Map<String, Object> dispatchResponse){
        if (dispatchResponse == null) {
            throw new IllegalArgumentException("Invalid response format");
        }

        List<Map<String, Boolean>> wildCards = (List<Map<String, Boolean>>) dispatchResponse.getOrDefault("wildCards", new ArrayList<>());

    Map<String, Object> logicErrors = (Map<String, Object>) dispatchResponse.getOrDefault("logicErrors", new ArrayList<>());

        List<String> vehicleImage = (List<String>) dispatchResponse.getOrDefault("vehicleImage", new ArrayList<>());

        List<Map<String, Double>> healthAttributes = (List<Map<String, Double>>) dispatchResponse.getOrDefault("healthAttributes", new ArrayList<>());

        double safetyScore = dispatchResponse.get("safetyScore") instanceof Number
                ? ((Number) dispatchResponse.get("safetyScore")).doubleValue()
                : 0.0;

        boolean canDispatch = dispatchResponse.get("canDispatch") instanceof Boolean && (Boolean) dispatchResponse.get("canDispatch");
        // Return a new DTO instance
        return new UtilRecords.DispatchResponseDTO(wildCards, safetyScore, healthAttributes, canDispatch,logicErrors,vehicleImage);
    }


}
