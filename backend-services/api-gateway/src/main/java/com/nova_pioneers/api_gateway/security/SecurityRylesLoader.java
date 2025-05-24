package com.nova_pioneers.api_gateway.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.nova_pioneers.api_gateway.model.SecurityRule;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class SecurityRulesLoader {
    private static final Logger logger = LoggerFactory.getLogger(SecurityRulesLoader.class);
    private final ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Service security rules
    private final List<SecurityRule> allRules = new ArrayList<>();

    // Security rule files to load
    private static final String[] SECURITY_FILES = {
            "security/admin-service.yml",
            "security/auth-service.yml",
            "security/parents-kids-service.yml",
            "security/teachers-courses-service.yml"
    };

    @PostConstruct
    public void loadSecurityRules() {
        for (String securityFile : SECURITY_FILES) {
            try {
                List<SecurityRule> rules = loadRulesFromYaml(securityFile);
                allRules.addAll(rules);
                logger.info("Loaded {} security rules from {}", rules.size(), securityFile);
            } catch (IOException e) {
                // Log warning but continue - missing files shouldn't crash the application
                logger.warn("Could not load security rules from {}: {}", securityFile, e.getMessage());
            }
        }

        logger.info("Total security rules loaded: {}", allRules.size());
    }

    /**
     * Load security rules from a YAML file
     */
    private List<SecurityRule> loadRulesFromYaml(String path) throws IOException {
        Resource resource = new ClassPathResource(path);

        // Use Jackson to parse YAML
        Map<String, Object> yamlMap = yamlMapper.readValue(resource.getInputStream(), HashMap.class);

        List<SecurityRule> rules = new ArrayList<>();

        // Parse paths section
        if (yamlMap.containsKey("paths")) {
            List<Map<String, Object>> paths = (List<Map<String, Object>>) yamlMap.get("paths");

            for (Map<String, Object> pathConfig : paths) {
                SecurityRule rule = new SecurityRule();
                rule.setPattern((String) pathConfig.get("pattern"));

                if (pathConfig.containsKey("roles")) {
                    rule.setRoles((List<String>) pathConfig.get("roles"));
                } else {
                    rule.setRoles(new ArrayList<>());
                }

                if (pathConfig.containsKey("authenticated")) {
                    rule.setAuthenticated((Boolean) pathConfig.get("authenticated"));
                }

                rules.add(rule);
            }
        }

        return rules;
    }

    /**
     * Check if a path requires authentication
     */
    public boolean requiresAuthentication(String path) {
        for (SecurityRule rule : allRules) {
            if (pathMatcher.match(rule.getPattern(), path)) {
                return rule.isAuthenticated();
            }
        }

        // Default: require authentication if no rule matches
        return true;
    }

    /**
     * Check if a role is allowed to access a path
     */
    public boolean isAccessAllowed(String path, String role) {
        if (role == null) {
            return false;
        }

        for (SecurityRule rule : allRules) {
            if (pathMatcher.match(rule.getPattern(), path)) {
                // If path doesn't require authentication, allow access
                if (!rule.isAuthenticated()) {
                    return true;
                }

                // If no roles specified, any authenticated user can access
                if (rule.getRoles() == null || rule.getRoles().isEmpty()) {
                    return true;
                }

                // Check if user's role is in the allowed roles
                return rule.getRoles().contains(role);
            }
        }

        // Default: deny access if no rule matches
        return false;
    }
}