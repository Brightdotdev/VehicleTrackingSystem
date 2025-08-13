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

    @Value("${auth.api.key}")
    private String internalApiKey;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // Log incoming request path
        logger.info("Incoming request path: {}", path);

        String token = null;

        // Paths that bypass JWT auth
        if (path.contains("/v1/auth/") || path.contains("/v1/oauth/")) {
            logger.info("Path '{}' bypasses JWT authentication.", path);
            return chain.filter(exchange);
        }

        // Internal API key check for /internal paths
        if (path.startsWith("/internal")) {
            String internalKey = request.getHeaders().getFirst("X-Internal-API-Key");
            logger.info("Internal API key received: {}", internalKey);

            if (internalKey == null || !internalKey.equals(internalApiKey)) {
                logger.warn("Unauthorized access attempt to internal API: invalid or missing key");
                return unauthorizedResponse(exchange, "Unauthorized: Invalid internal API key");
            }
            logger.info("Internal API key validated successfully.");
            return chain.filter(exchange);
        }

        // Check if this is an admin endpoint
        boolean isAdminEndpoint = path.startsWith("/v1/admin");
        logger.info("Is admin endpoint: {}", isAdminEndpoint);

        // Extract token from cookies based on endpoint type
        if (isAdminEndpoint) {
            logger.info("Attempting to get JWT from 'adminDeskCookie'");
            token = getJwtFromCookies(request, "adminDeskCookie");
        } else {
            logger.info("Attempting to get JWT from 'userDeskToken'");
            token = getJwtFromCookies(request, "userDeskToken");
        }

        // Fallback: if no token found and adminDeskCookie exists, use it
        if (token == null && getJwtFromCookies(request, "adminDeskCookie") != null) {
            logger.info("No token found in userDeskToken, falling back to 'adminDeskCookie'");
            token = getJwtFromCookies(request, "adminDeskCookie");
        }

        logger.info("JWT token extracted: {}", token != null ? "[PROTECTED]" : "null");

        // If no token, reject request
        if (token == null) {
            logger.warn("Unauthorized: Missing or invalid token");
            return unauthorizedResponse(exchange, "Unauthorized: Missing or invalid token");
        }

        try {
            // Parse and validate JWT token
            SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            logger.info("Parsing JWT token");
            Jws<Claims> jws = Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            Claims claims = jws.getBody();

            logger.info("JWT claims extracted: subject='{}', roles='{}'",
                    claims.getSubject(), claims.get("roles"));

            // Check required claims
            if (!claims.containsKey("roles") || claims.getSubject() == null) {
                logger.warn("Unauthorized: Missing required claims in token");
                return unauthorizedResponse(exchange, "Unauthorized: Missing required claims");
            }

            logger.info("Token validation successful, proceeding with filter chain.");
            // Continue filter chain if token is valid
            return chain.filter(exchange);

        } catch (Exception ex) {
            logger.error("Unauthorized: Token expired or invalid", ex);
            return unauthorizedResponse(exchange, "Unauthorized: Token expired or invalid");
        }
    }

    @Override
    public int getOrder() {
        return -1; // Run early in the filter chain
    }

    /**
     * Helper method to extract JWT token from specified cookie name.
     */
    private String getJwtFromCookies(ServerHttpRequest request, String cookieName) {
        List<String> cookieHeaders = request.getHeaders().get(HttpHeaders.COOKIE);
        if (cookieHeaders != null) {
            for (String header : cookieHeaders) {
                String[] cookies = header.split(";");
                for (String cookie : cookies) {
                    cookie = cookie.trim();
                    if (cookie.startsWith(cookieName + "=")) {
                        logger.info("Found cookie '{}' with value '[PROTECTED]'", cookieName);
                        return cookie.substring((cookieName + "=").length());
                    }
                }
            }
        }
        logger.info("Cookie '{}' not found in request", cookieName);
        return null;
    }

    /**
     * Builds a Mono response with a 401 Unauthorized status.
     */
    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        logger.warn("Sending 401 Unauthorized response: {}", message);
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");

        String body = "{\"error\": \"" + message + "\"}";
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }
}
