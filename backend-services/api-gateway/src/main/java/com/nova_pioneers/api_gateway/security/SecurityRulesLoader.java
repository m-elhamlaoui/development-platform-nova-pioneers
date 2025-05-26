package com.nova_pioneers.api_gateway.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct; // JAKARTA not javax
import java.io.InputStream;
import java.util.*;
import java.util.regex.Pattern;

@Component
public class SecurityRulesLoader {

    private Map<String, List<SecurityRule>> serviceRules = new HashMap<>();
    private final ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());

    @PostConstruct
    public void loadSecurityRules() {
        String[] services = {"admin-service", "auth-service", "parents-kids-service", "teachers-courses-service"};

        for (String service : services) {
            try {
                String filename = "security/" + service + "-security.yml";
                ClassPathResource resource = new ClassPathResource(filename);

                if (resource.exists()) {
                    InputStream inputStream = resource.getInputStream();
                    Map<String, Object> data = yamlMapper.readValue(inputStream, Map.class);

                    List<SecurityRule> rules = parseSecurityRules(data);
                    serviceRules.put(service, rules);

                    System.out.println("Loaded " + rules.size() + " security rules for " + service);
                } else {
                    System.out.println("Security rules file not found: " + filename);
                }
            } catch (Exception e) {
                System.err.println("Error loading security rules for " + service + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    @SuppressWarnings("unchecked")
    private List<SecurityRule> parseSecurityRules(Map<String, Object> data) {
        List<SecurityRule> rules = new ArrayList<>();

        if (data.containsKey("paths")) {
            List<Map<String, Object>> paths = (List<Map<String, Object>>) data.get("paths");

            for (Map<String, Object> pathData : paths) {
                SecurityRule rule = new SecurityRule();

                rule.pattern = (String) pathData.get("pattern");
                rule.authenticated = (Boolean) pathData.getOrDefault("authenticated", true);

                // Handle roles
                Object rolesObj = pathData.get("roles");
                if (rolesObj instanceof List) {
                    rule.roles = new HashSet<>((List<String>) rolesObj);
                } else {
                    rule.roles = new HashSet<>();
                }

                // Handle methods
                Object methodsObj = pathData.get("methods");
                if (methodsObj instanceof List) {
                    rule.methods = new HashSet<>((List<String>) methodsObj);
                } else {
                    rule.methods = new HashSet<>(); // Empty means all methods
                }

                rules.add(rule);
            }
        }

        return rules;
    }

    public boolean requiresAuthentication(String path, String method) {
        String service = extractServiceFromPath(path);
        List<SecurityRule> rules = serviceRules.get(service);

        if (rules == null) {
            return true;
        }

        SecurityRule matchingRule = findMatchingRule(rules, path, method);

        if (matchingRule != null) {
            return matchingRule.authenticated;
        }

        return true;
    }

    public boolean isAccessAllowed(String path, String method, String userRole) {
        String service = extractServiceFromPath(path);
        List<SecurityRule> rules = serviceRules.get(service);

        if (rules == null) {
            return false;
        }

        SecurityRule matchingRule = findMatchingRule(rules, path, method);

        if (matchingRule != null) {
            if (matchingRule.roles.isEmpty()) {
                return true;
            }

            return matchingRule.roles.contains(userRole);
        }

        return false;
    }

    private String extractServiceFromPath(String path) {
        if (path.startsWith("/admin")) {
            return "admin-service";
        } else if (path.startsWith("/auth")) {
            return "auth-service";
        } else if (path.startsWith("/parents-kids")) {
            return "parents-kids-service";
        } else if (path.startsWith("/teachers-courses")) {
            return "teachers-courses-service";
        }

        return "unknown";
    }

    private SecurityRule findMatchingRule(List<SecurityRule> rules, String path, String method) {
        SecurityRule bestMatch = null;
        int bestMatchScore = -1;

        for (SecurityRule rule : rules) {
            if (pathMatches(rule.pattern, path) && methodMatches(rule.methods, method)) {
                int score = calculateSpecificityScore(rule.pattern);

                if (score > bestMatchScore) {
                    bestMatch = rule;
                    bestMatchScore = score;
                }
            }
        }

        return bestMatch;
    }

    private boolean pathMatches(String pattern, String path) {
        String regex = pattern
                .replace("**", ".*")
                .replace("*", "[^/]*");

        return Pattern.matches(regex, path);
    }

    private boolean methodMatches(Set<String> allowedMethods, String method) {
        return allowedMethods.isEmpty() || allowedMethods.contains(method);
    }

    private int calculateSpecificityScore(String pattern) {
        int score = 0;
        score += pattern.length();
        score -= pattern.split("\\*").length * 10;
        return score;
    }

    private static class SecurityRule {
        String pattern;
        boolean authenticated;
        Set<String> roles = new HashSet<>();
        Set<String> methods = new HashSet<>();
    }
}