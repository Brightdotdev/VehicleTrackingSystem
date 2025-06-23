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


        String token = null;

        // Skip JWT check for public auth endpoints
        if (path.startsWith("/internal") ||
                path.contains("/v1/auth/") ||
                path.contains("/v1/oauth/")) {
            return chain.filter(exchange);
        }


        // Check if this is an admin endpoint
        boolean isAdminEndpoint = path.startsWith("/v1/admin");

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
        if (isAdminEndpoint) {

            // Try Authorization header first

            // Fallback to admin cookie if no token in header
            if (token == null) {
                token = getJwtFromCookies(request, "adminDeskCookie");
            }



        } else {
            // For regular users, try Authorization header first

            // If not in header, fallback to user cookie
            if (token == null) {
                token = getJwtFromCookies(request, "userDeskToken");
            } if(token == null && getJwtFromCookies(request, "adminDeskCookie") != null ){

                    token = getJwtFromCookies(request, "adminDeskCookie");
                }



            }


        // If still no token, return unauthorized
        if (token == null) {

            return unauthorizedResponse(exchange, "Unauthorized: Missing or invalid token");
        }

        try {
            // Build the secret key
            SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));


            // Parse and validate the JWT
            Jws<Claims> jws = Jwts.parser()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);

            Claims claims = jws.getBody();
            String subject = claims.getSubject();

            Object claim = claims.get("roles");


            // Modify request to include extra headers
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("x-user-email", subject)
//                    .header("x-user-roles", roles)
                    .header("x-user-token", token)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception ex) {
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
                        return cookie.substring((cookieName + "=").length());
                    }
                }
            }
        }
        return null;
    }

    /**
     * Builds a Mono response with a 401 Unauthorized status.
     */
    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");

        String body = "{\"error\": \"" + message + "\"}";
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }
}
