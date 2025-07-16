package com.example.VehicleService.Messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class JsonMapper {

    private static final Logger logger = LoggerFactory.getLogger(JsonMapper.class);

    private final ObjectMapper mapper;

    public JsonMapper() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule()); // for LocalDateTime, etc.
        this.mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // ISO format
    }

    /**
     * convert to json for debuggging
     */
    public String convertToJson(Object payload) {
        try {
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            logger.error("❌ Failed to serialize payload: {}",  e.getMessage());
            return "It didn't work";
        }
    }


    /**
     * ✅ Convert the object to Map<String, Object>
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> convertToMap(Object payload, String contextLabel) {
        try {
            Map<String, Object> result = mapper.convertValue(payload, Map.class);
            logger.info("✅ [{}] converted to Map with {} keys", contextLabel, result.size());
            return result;
        } catch (IllegalArgumentException e) {
            logger.error("❌ Failed to convert [{}] to Map: {}", contextLabel, e.getMessage(), e);
            return Map.of("error", "Conversion failed", "reason", e.getMessage());
        }
    }


}
