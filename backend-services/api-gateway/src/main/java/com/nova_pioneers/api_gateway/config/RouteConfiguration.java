package com.nova_pioneers.api_gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfiguration {

    @Value("${ADMIN_SERVICE_URI:http://admin-service:9091}")
    private String adminServiceUri;

    @Value("${AUTH_SERVICE_URI:http://auth-service:9092}")
    private String authServiceUri;

    @Value("${PARENTS_KIDS_SERVICE_URI:http://parents-kids-service:9093}")
    private String parentsKidsServiceUri;

    @Value("${TEACHERS_COURSES_SERVICE_URI:http://teachers-courses-service:9094}")
    private String teachersCoursesServiceUri;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Admin Service Routes
                .route("admin-service", r -> r.path("/admin/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri(adminServiceUri))

                // Auth Service Routes
                .route("auth-service", r -> r.path("/auth/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri(authServiceUri))

                // Parents-Kids Service Routes
                .route("parents-kids-service", r -> r.path("/parents-kids/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri(parentsKidsServiceUri))

                // Teachers-Courses Service Routes
                .route("teachers-courses-service", r -> r.path("/teachers-courses/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri(teachersCoursesServiceUri))

                .build();
    }
}