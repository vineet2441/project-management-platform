package com.projectmanagement.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        logger.debug("JwtAuthenticationFilter called for path: {}", request.getRequestURI());

        // Skip JWT validation for /api/auth/** endpoints
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth/")) {
            logger.debug("Skipping JWT validation for auth endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Get JWT token from Authorization header
            String jwt = getJwtFromRequest(request);
            logger.debug("JWT from request: {}", jwt != null ? "present" : "null");

            // Validate token
            if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
                logger.debug("JWT token is valid");
                // Get username from token
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                logger.debug("Username from token: {}", username);

                // Load user details
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                logger.debug("User loaded: {}", userDetails.getUsername());

                // Create authentication token
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set authentication in security context
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("Authentication set in security context");
            } else {
                logger.debug("JWT token invalid or null");
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    // Extract JWT token from Authorization header
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", bearerToken != null ? "present" : "null");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            logger.debug("Extracted Bearer token: {}", token.isEmpty() ? "empty" : "present");
            return token;
        }
        return null;

    }

}
