package com.example.UserService.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;


@Component
public class JwtConfig {


    private static final Logger logger = LoggerFactory.getLogger(JwtConfig.class);

    private final SecretKey secretKey;
    private static final long EXPIRATION_TIME = 86400000; // 24 hours

    public JwtConfig(SecretKey secretKey) {
        this.secretKey = secretKey;
    }

    public String extractUsername(String token) {
        logger.info("Extracting username from token: {}", token);
        String username = validateToken(token).getBody().getSubject();
        logger.info("Extracted username: {}", username);
        return username;
    }


    public boolean isTokenExpired(String token) {
        logger.info("Checking if token is expired: {}", token);
        Date expiration = validateToken(token).getBody().getExpiration();
        boolean isExpired = expiration.before(new Date());
        logger.info("Is token expired? {}", isExpired);
        return isExpired;
    }


    public Claims getClaims(String token) {
        logger.info("Extracting claims from token: {}", token);
        Claims claims = validateToken(token).getBody();
        logger.info("Extracted claims: {}", claims);
        return claims;
    }



    public Jws<Claims> validateToken(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseClaimsJws(token);
    }


}
