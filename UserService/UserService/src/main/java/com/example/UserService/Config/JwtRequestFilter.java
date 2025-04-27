package com.example.UserService.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
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
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtConfig jwtConfig;
    private final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    // 🔁 Constructor injection for JwtConfig
    public JwtRequestFilter(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String jwt = null;
        String username = null;
        List<String> roles = new ArrayList<>();

        logger.info("Processing request: {} {}", request.getMethod(), request.getRequestURI());

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7); // Extract token
            logger.debug("JWT extracted from Authorization header");

            try {
                if (jwtConfig.validateToken(jwt)) {
                    logger.debug("JWT is valid");

                    Claims claims = jwtConfig.getClaims(jwt);
                    username = claims.getSubject();

                    logger.info("Token subject (username): {}", username);

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

            logger.warn("Missing or invalid Authorization header");
            logger.debug("No Bearer token found in Authorization header");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized Request: You're not acc allowed here lol\"}");
            return;
        }

        // Set authentication in Spring Security if user info is extracted
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authToken);
            logger.info("SecurityContext set for user: {}", username);
        }

        // ▶️ Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
