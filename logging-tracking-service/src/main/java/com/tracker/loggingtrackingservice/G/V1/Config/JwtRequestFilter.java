package com.tracker.loggingtrackingservice.G.V1.Config;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtConfig jwtConfig;
    private final AuthProperties authProperties;
    private final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    public JwtRequestFilter(JwtConfig jwtConfig, AuthProperties authProperties) {
        this.jwtConfig = jwtConfig;
        this.authProperties = authProperties;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        final String path = request.getRequestURI();


        if (path.startsWith("/internal")) {

            String apiKey = request.getHeader("X-Internal-API-Key");
            
            String expectedKey = authProperties.getApi().getKey();


            if (expectedKey != null && expectedKey.equals(apiKey)) {
                logger.info("Internal API key authorized for {}", path);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken("internal-service", null, List.of());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
                filterChain.doFilter(request, response);
                return;
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Unauthorized: Invalid or missing internal API key\"}");
                return;
            }
        }


        final List<String> roles = new ArrayList<>();
        Object image = null;
        Object name = null;
        String email = null;
        String token = request.getHeader("x-user-token");



        if (token == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }}


        if (token == null && request.getCookies() != null) {

            boolean isAdminPath = path.startsWith("/v1/admin");

            for (Cookie cookie : request.getCookies()) {
                if (isAdminPath && "adminDeskCookie".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                } else if (!isAdminPath && "userDeskToken".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token != null) {
            try {
                if (jwtConfig.validateToken(token)) {
                    Claims claims = jwtConfig.getClaims(token);
                    email = claims.getSubject();
                    image = claims.get("userImage");
                    name = claims.get("name");


                    Object rawRoles = claims.get("roles");
                    if (rawRoles instanceof List<?>) {
                        for (Object role : (List<?>) rawRoles) {
                            roles.add(String.valueOf(role));
                        }
                    }
                }
            } catch (ExpiredJwtException | MalformedJwtException |
                     UnsupportedJwtException | SignatureException |
                     IllegalArgumentException e) {
                logger.warn("JWT validation failed: {}", e.getMessage());
            }
        }


        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);

            Map<String, Object> details = new HashMap<>();
            details.put("userImage", image);
            details.put("name", name);
            authToken.setDetails(details);

            SecurityContextHolder.getContext().setAuthentication(authToken);
        } else if (email == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized Request: You're not allowed here\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
