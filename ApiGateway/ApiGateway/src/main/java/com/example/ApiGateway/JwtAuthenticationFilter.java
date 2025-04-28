package com.example.ApiGateway;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Value("${auth.jwt.secret}")
    private String jwtSecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        logger.info("Incoming request: {} {}", request.getMethod(), path);

        // Skip filter for public auth endpoints
        if (path.contains("/v1/auth/") || path.contains("/v1/oauth/")) {
            logger.info("Skipping JWT filter for public auth endpoint: {}", path);
            return chain.filter(exchange);
        }

        // First try to extract the token from the Authorization header
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            logger.debug("Extracted JWT token from Authorization header: {}", token);
        }


        if (token == null) {
            token = getJwtFromCookies(request);
            if (token != null) {
                logger.debug("Extracted JWT token from Cookies: {}", token);
            }
        }


        if (token == null) {
            logger.warn("Missing or invalid Authorization header and Cookie");
            return unauthorizedResponse(exchange, "Unauthorized: Missing or invalid token");
        }


        try {
            SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            logger.debug("JWT secret key initialized");

            Jws<Claims> jws = Jwts.parser()
                    .setSigningKey(secretKey)
                    .build().parseClaimsJws(token);

            Claims claims = jws.getBody();
            String subject = claims.getSubject();

            String role = claims.get("role", String.class);
            logger.info("JWT validated. Subject (email): {}", subject);


            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("x-user-email", subject)
                    .header("x-user-role", role)
                    .header("x-user-token", token)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception ex) {
            logger.error("JWT validation failed: {}", ex.getMessage());
            return unauthorizedResponse(exchange, "Unauthorized: Token expired or invalid");
        }
    }

    @Override
    public int getOrder() {
        return -1; // Run early
    }


    private String getJwtFromCookies(ServerHttpRequest request) {
        List<String> cookieHeaders = request.getHeaders().get(HttpHeaders.COOKIE);
        if (cookieHeaders != null) {
            for (String header : cookieHeaders) {
                String[] cookies = header.split(";");
                for (String cookie : cookies) {
                    cookie = cookie.trim();
                    if (cookie.startsWith("userDeskToken=")) {
                        return cookie.substring("userDeskToken=".length());
                    }
                }
            }
        }
        return null;
    }



    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");

        String body = "{\"error\": \"" + message + "\"}";
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

}
