package com.example.VehicleService.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "https://user-auto-port-web.vercel.app",
                                "https://vehicle-tracking-system-sandy.vercel.app",
                                "http://localhost:3000",
                                "http://localhost:3001"
                        )
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true); // 🔥 REQUIRED for cookies
            }
        };
    }
}