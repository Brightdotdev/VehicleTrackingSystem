package com.example.DispatchService.Messaging.WebClient;


import com.example.DispatchService.Messaging.ResponseMapperService;
import com.example.DispatchService.Utils.UtilRecords;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "webClient", matchIfMissing = true)
public class WebClientResponseMapper implements ResponseMapperService {

    private final ObjectMapper mapper;

    public WebClientResponseMapper() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

        public Map<String, Object> dispatchRequestMapper(Object response) {

            String json = null;

            try {
                json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(response);

                System.out.println(json);

                @SuppressWarnings("unchecked")
                Map<String, Object> result =  (Map<String, Object>) mapper.convertValue(response, new TypeReference<Map<String, Object>>() {}).get("data");


                return result;
            } catch (JsonProcessingException e) {
                System.out.println("❌ Failed to handle created admin response: " + e.getMessage());
                return Collections.emptyMap();
            }
        }

    public UtilRecords.DispatchResponseDTO dispatchResponseMapper (Map<String, Object> dispatchResponse){

        if (dispatchResponse == null) {
            throw new IllegalArgumentException("Invalid response format");
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Boolean>> wildCards = (List<Map<String, Boolean>>) dispatchResponse.getOrDefault("wildCards", new ArrayList<>());

        @SuppressWarnings("unchecked")
        Map<String, Object> logicErrors = (Map<String, Object>) dispatchResponse.getOrDefault("logicErrors", new ArrayList<>());

        @SuppressWarnings("unchecked")
        List<String> vehicleImage = (List<String>) dispatchResponse.getOrDefault("vehicleImage", new ArrayList<>());

        @SuppressWarnings("unchecked")
        List<Map<String, Double>> healthAttributes = (List<Map<String, Double>>) dispatchResponse.getOrDefault("healthAttributes", new ArrayList<>());


        double safetyScore = dispatchResponse.get("safetyScore") instanceof Number
                ? ((Number) dispatchResponse.get("safetyScore")).doubleValue()
                : 0.0;

        boolean canDispatch = dispatchResponse.get("canDispatch") instanceof Boolean && (Boolean) dispatchResponse.get("canDispatch");
        // Return a new DTO instance
        return new UtilRecords.DispatchResponseDTO(wildCards, safetyScore, healthAttributes, canDispatch,logicErrors,vehicleImage);
    }


}
