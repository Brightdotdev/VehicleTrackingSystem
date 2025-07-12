package com.example.AuthService.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtConfig {

    private final AuthProperties authProperties;

    public JwtConfig(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(authProperties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public long getExpiration() {
        return authProperties.getJwt().getExpiration();
    }



    public String generateToken(Authentication auth, String userImage, String name) {

        Object principal = auth.getPrincipal();
        String username;
        List<String> roles;



        if (principal instanceof UserDetails userDetails) {

            username = userDetails.getUsername();
            roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

        }
        else {
            throw new IllegalArgumentException("Unsupported principal type: " + principal.getClass());
        }

        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .claim("userImage", userImage)
                .claim("name", name)
                .expiration(new Date(System.currentTimeMillis() + getExpiration()))
                .signWith(getSecretKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }




    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    @Bean
    public SecretKey jwtSecretKey() {
        return getSecretKey();
    }


}
