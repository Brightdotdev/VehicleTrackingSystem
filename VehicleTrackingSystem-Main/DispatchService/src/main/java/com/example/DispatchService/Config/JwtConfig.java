package com.example.DispatchService.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@ConfigurationProperties(prefix = "auth.jwt")
public class JwtConfig {


    private final JwtProperties jwtProperties;

    public JwtConfig(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    }
    @Bean
    public SecretKey jwtSecretKey() {
        return getSecretKey();
    }


    public long getExpiration() {
        return jwtProperties.getExpiration();
    }


        public boolean validateToken(String token) {
            try {
                Claims claims = getClaims(token);
                return claims.getExpiration().after(new Date());
            } catch (Exception e) {
                return false;
            }
        }

        public String extractToken(HttpServletRequest request) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                return authHeader.substring(7).trim(); // Use .trim() to remove leading/trailing spaces
            }
            return null;
        }


        public String extractUser(String token) {
            return getClaims(token).getSubject();
        }


        public boolean isTokenExpired(String token) {
            return getClaims(token).getExpiration().before(new Date());
        }


        Claims getClaims(String token) {
            return Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        }

    }


