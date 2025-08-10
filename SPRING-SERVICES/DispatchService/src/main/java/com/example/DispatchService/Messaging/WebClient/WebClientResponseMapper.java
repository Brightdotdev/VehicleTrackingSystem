package com.example.DispatchService.Messaging.WebClient;

import com.example.DispatchService.Messaging.ResponseMapperService;
import com.example.DispatchService.Utils.UtilRecords;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@ConditionalOnProperty(name = "messaging.type", havingValue = "webClient", matchIfMissing = true)
public class WebClientResponseMapper implements ResponseMapperService {

    private static final Logger logger = LoggerFactory.getLogger(WebClientResponseMapper.class);

    private final ObjectMapper mapper;

    /**
     * Initializes Jackson ObjectMapper with support for Java Time types
     * and disables writing dates as timestamps (ISO format instead).
     */
    public WebClientResponseMapper() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    /**
     * Converts a raw response object (usually from WebClient) to a Map<String, Object>
     * by extracting the "data" field.
     * Returns an empty map if conversion fails or data is missing.
     *
     * @param response the raw response object to map
     * @return extracted "data" as a Map, or empty map if unavailable
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> dispatchRequestMapper(Object response) {
        if (response == null) {
            logger.warn("dispatchRequestMapper called with null response");
            return Collections.emptyMap();
        }

        try {
            String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(response);
            logger.debug("Raw response JSON: {}", json);

            Map<String, Object> fullMap = mapper.convertValue(response, new TypeReference<>() {});
            Object dataObj = fullMap.get("data");

            if (dataObj instanceof Map) {
                return (Map<String, Object>) dataObj;
            } else {
                logger.warn("dispatchRequestMapper: 'data' field is missing or not a map");
                return Collections.emptyMap();
            }
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize response in dispatchRequestMapper: {}", e.getMessage(), e);
            return Collections.emptyMap();
        } catch (IllegalArgumentException e) {
            logger.error("Failed to convert response to map in dispatchRequestMapper: {}", e.getMessage(), e);
            return Collections.emptyMap();
        }
    }

    /**
     * Maps a dispatch response represented as a Map<String, Object> to a strongly typed DispatchResponseDTO.
     * Uses defaults and type checking for safety.
     *
     * @param dispatchResponse map representing the dispatch response data
     * @return DispatchResponseDTO with parsed data
     * @throws IllegalArgumentException if input is null
     */
    @SuppressWarnings("unchecked")
    public UtilRecords.DispatchResponseDTO dispatchResponseMapper(Map<String, Object> dispatchResponse) {
        if (dispatchResponse == null) {
            throw new IllegalArgumentException("Invalid response format: null");
        }

        List<Map<String, Boolean>> wildCards = (List<Map<String, Boolean>>) dispatchResponse.getOrDefault("wildCards", new ArrayList<>());
        Map<String, Object> logicErrors = (Map<String, Object>) dispatchResponse.getOrDefault("logicErrors", Collections.emptyMap());
        List<String> vehicleImage = (List<String>) dispatchResponse.getOrDefault("vehicleImage", new ArrayList<>());
        List<Map<String, Double>> healthAttributes = (List<Map<String, Double>>) dispatchResponse.getOrDefault("healthAttributes", new ArrayList<>());

        double safetyScore = 0.0;
        Object safetyScoreObj = dispatchResponse.get("safetyScore");
        if (safetyScoreObj instanceof Number) {
            safetyScore = ((Number) safetyScoreObj).doubleValue();
        }

        boolean canDispatch = false;
        Object canDispatchObj = dispatchResponse.get("canDispatch");
        if (canDispatchObj instanceof Boolean) {
            canDispatch = (Boolean) canDispatchObj;
        }

        return new UtilRecords.DispatchResponseDTO(wildCards, safetyScore, healthAttributes, canDispatch, logicErrors, vehicleImage);
    }
}
