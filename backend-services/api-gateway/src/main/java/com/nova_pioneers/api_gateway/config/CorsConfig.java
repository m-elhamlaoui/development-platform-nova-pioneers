package com.nova_pioneers.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // Allow your frontend origin
        corsConfig.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",    // Vite dev server
                "http://localhost:3000",    // Alternative React dev server
                "http://localhost:8080"     // Additional dev server
        ));

        // Allow all common HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // Allow all headers (including Authorization for JWT)
        corsConfig.setAllowedHeaders(Arrays.asList("*"));

        // Allow credentials (needed for JWT tokens)
        corsConfig.setAllowCredentials(true);

        // Expose Authorization header to frontend
        corsConfig.setExposedHeaders(Arrays.asList("Authorization"));

        // Cache preflight requests for 1 hour
        corsConfig.setMaxAge(3600L);

        // Apply to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}