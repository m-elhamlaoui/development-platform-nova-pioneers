package com.nova_pioneers.api_gateway.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Represents a security rule for path-based authorization
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecurityRule {
    /**
     * Path pattern for this rule (e.g., "/admin/**")
     */
    private String pattern;

    /**
     * List of roles allowed to access this path
     */
    private List<String> roles;

    /**
     * Whether this path requires authentication
     * If false, path is public and no authentication is required
     */
    private boolean authenticated = true;
}