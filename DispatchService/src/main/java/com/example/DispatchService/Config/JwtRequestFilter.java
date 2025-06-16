package com.example.DispatchService.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
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
    private final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);


    public JwtRequestFilter(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String path = request.getRequestURI();
        final String headerEmail = request.getHeader("x-user-email");
        String email = null;
        Object image = null;
        final List<String> headerRoles = Collections.singletonList(request.getHeader("x-user-roles"));
        final List<String> roles = new ArrayList<>();

        String token = request.getHeader("x-user-token");

        // Fallback to Authorization header if x-user-token is missing
        if (token == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                logger.debug("JWT extracted from Authorization header");
            }
        }

        // Fallback to cookie
        if (token == null && request.getCookies() != null) {
            // Check if the path is under /v1/admin
            boolean isAdminPath = path.startsWith("/v1/admin");

            for (Cookie cookie : request.getCookies()) {
                if (isAdminPath && "adminDeskCookie".equals(cookie.getName())) {
                    // Use admin cookie for admin routes
                    token = cookie.getValue();
                    logger.debug("Admin JWT extracted from adminDeskCookie cookie");
                    break;
                } else if (!isAdminPath && "userDeskToken".equals(cookie.getName())) {
                    // Use regular user cookie for non-admin routes
                    token = cookie.getValue();
                    logger.debug("User JWT extracted from userDeskToken cookie");
                    break;
                }
            }
        }

        logger.info("Processing request: {} {}", request.getMethod(), request.getRequestURI());

        // If JWT is found, validate it
        if (token != null) {
            try {
                if (jwtConfig.validateToken(token)) {
                    logger.debug("JWT is valid");

                    Claims claims = jwtConfig.getClaims(token);
                    email = claims.getSubject();
                    logger.info("Token subject (email): {}", email);
                    logger.info("Token subject (header email): {}", headerEmail);
                    image = claims.get("userImage");
                    Object rawRoles = claims.get("roles");
                    if (rawRoles instanceof List<?>) {
                        for (Object role : (List<?>) rawRoles) {
                            roles.add(String.valueOf(role));
                        }
                        logger.debug("Extracted roles: {}", roles);
                    }
                } else {
                    logger.warn("Token failed validation");
                }

            } catch (ExpiredJwtException e) {
                logger.warn("JWT expired: {}", e.getMessage());
            } catch (MalformedJwtException e) {
                logger.warn("Malformed JWT: {}", e.getMessage());
            } catch (UnsupportedJwtException e) {
                logger.warn("Unsupported JWT: {}", e.getMessage());
            } catch (SignatureException e) {
                logger.warn("JWT signature invalid: {}", e.getMessage());
            } catch (IllegalArgumentException e) {
                logger.warn("Illegal JWT argument: {}", e.getMessage());
            }
        } else {
            logger.warn("Missing or invalid Authorization header and cookie");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized Request: You're not allowed here\"}");
            return;
        }

        // Set authentication if user info is extracted
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());


            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            Map<String, Object> details = new HashMap<>();
            details.put("userImage", image);


            authToken.setDetails(details);
            SecurityContextHolder.getContext().setAuthentication(authToken);



            logger.info("SecurityContext set for user: {}", email);
        }

        filterChain.doFilter(request, response);
    }


}