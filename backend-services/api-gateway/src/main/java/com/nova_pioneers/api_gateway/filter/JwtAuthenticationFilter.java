package com.nova_pioneers.api_gateway.filter;

import com.nova_pioneers.api_gateway.repository.TokenRepository;
import com.nova_pioneers.api_gateway.security.JwtUtil;
import com.nova_pioneers.api_gateway.security.SecurityRulesLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final TokenRepository tokenRepository;
    private final SecurityRulesLoader securityRulesLoader;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, TokenRepository tokenRepository, SecurityRulesLoader securityRulesLoader) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
        this.tokenRepository = tokenRepository;
        this.securityRulesLoader = securityRulesLoader;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();

            // Check if path requires authentication
            if (!securityRulesLoader.requiresAuthentication(path)) {
                // No authentication required, proceed
                return chain.filter(exchange);
            }

            // Get Authorization header
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            // Check if Authorization header is present and starts with "Bearer "
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("Missing or invalid Authorization header for path: {}", path);
                return onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
            }

            // Extract token
            String token = authHeader.substring(7);

            try {
                // Validate token signature and expiration
                if (!jwtUtil.validateToken(token)) {
                    logger.warn("Invalid JWT token for path: {}", path);
                    return onError(exchange, "Invalid JWT token", HttpStatus.UNAUTHORIZED);
                }

                // Check if token is revoked in database
                if (!tokenRepository.existsByTokenAndRevokedFalse(token)) {
                    logger.warn("Revoked JWT token used for path: {}", path);
                    return onError(exchange, "Token has been revoked", HttpStatus.UNAUTHORIZED);
                }

                // Extract user details from token
                Long userId = jwtUtil.extractUserId(token);
                String role = jwtUtil.extractRole(token);
                String email = jwtUtil.extractEmail(token);

                // Check if user has permission to access this path
                if (!securityRulesLoader.isAccessAllowed(path, role)) {
                    logger.warn("Access denied for role {} to path: {}", role, path);
                    return onError(exchange, "Access denied", HttpStatus.FORBIDDEN);
                }

                // Add user details to request headers for downstream services
                ServerHttpRequest modifiedRequest = request.mutate()
                        .header("X-User-Id", userId.toString())
                        .header("X-User-Role", role)
                        .header("X-User-Email", email)
                        .build();

                // Create a new exchange with the modified request
                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            } catch (Exception e) {
                logger.error("Error processing JWT token", e);
                return onError(exchange, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return response.setComplete();
    }

    public static class Config {
        // Configuration properties if needed
    }
}