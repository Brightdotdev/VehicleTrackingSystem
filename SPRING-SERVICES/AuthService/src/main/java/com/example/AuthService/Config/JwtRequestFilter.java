package com.example.AuthService.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// ✅ Must extend OncePerRequestFilter for Spring to recognize it as a security filter
@Component

public class JwtRequestFilter extends OncePerRequestFilter {


    private final AuthProperties authProperties;
    private final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    public JwtRequestFilter( AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String path = request.getRequestURI();

        // ✅ Handle internal API key auth
        if (path.startsWith("/internal")) {
            String apiKey = request.getHeader("X-Internal-API-Key");
            String expectedKey = authProperties.getApi().getKey();

            if (expectedKey != null && expectedKey.equals(apiKey)) {
                logger.info("Internal API key authorized for {}", path);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken("internal-service", null, List.of());

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);

                filterChain.doFilter(request, response); // 🔥 continue the chain
                return;
            } else {
                // 🔥 Send 401 for invalid or missing key
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Unauthorized: Invalid or missing internal API key\"}");
                return;
            }
        }

        // 🔥 If not internal, continue the filter chain (maybe to JWT logic later)
        filterChain.doFilter(request, response);
    }
}
