package com.example.AuthService.Services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
public class ResponseMapperService {

    private final ObjectMapper mapper;

    public ResponseMapperService() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }


    public Map<String, Object> createdAdminResponse(Object response) {
        try {

            String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(response);

            System.out.println(json);
            return mapper.convertValue(response, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            System.out.println("❌ Failed to handle created admin response: " + e.getMessage());
            return Collections.emptyMap();
        }
    }


}
