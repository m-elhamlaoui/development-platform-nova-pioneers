package com.nova_pioneers.api_gateway.config;

import com.nova_pioneers.api_gateway.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
public class SecurityConfiguration {

    @Autowired
    private Environment env;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Configure data source for database access
     */
    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(env.getProperty("spring.datasource.driver-class-name"));
        dataSource.setUrl(env.getProperty("spring.datasource.url"));
        dataSource.setUsername(env.getProperty("spring.datasource.username"));
        dataSource.setPassword(env.getProperty("spring.datasource.password"));
        return dataSource;
    }

    /**
     * Apply JWT filter to routes
     */
    @Bean
    public RouteLocator securedRoutes(RouteLocatorBuilder builder, RouteConfiguration routeConfig) {
        RouteLocatorBuilder.Builder routesBuilder = builder.routes();

        // Apply JWT authentication filter to all routes
        return routesBuilder
                // Admin Service Routes with JWT Filter
                .route("admin-service", r -> r.path("/admin/**")
                        .filters(f -> f
                                .filter(jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config()))
                                .stripPrefix(1))
                        .uri(routeConfig.getAdminServiceUri()))

                // Auth Service Routes
                // Note: Some auth endpoints don't need JWT validation (login, signup)
                .route("auth-service", r -> r.path("/auth/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri(routeConfig.getAuthServiceUri()))

                // Parents-Kids Service Routes with JWT Filter
                .route("parents-kids-service", r -> r.path("/parents-kids/**")
                        .filters(f -> f
                                .filter(jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config()))
                                .stripPrefix(1))
                        .uri(routeConfig.getParentsKidsServiceUri()))

                // Teachers-Courses Service Routes with JWT Filter
                .route("teachers-courses-service", r -> r.path("/teachers-courses/**")
                        .filters(f -> f
                                .filter(jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config()))
                                .stripPrefix(1))
                        .uri(routeConfig.getTeachersCoursesServiceUri()))

                .build();
    }
}