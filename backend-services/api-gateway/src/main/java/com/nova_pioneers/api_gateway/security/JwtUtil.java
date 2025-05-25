package com.nova_pioneers.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final SecretKey key;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        // FIXED: Use raw string instead of Base64 decoding to match auth-service
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Extract user ID from token
     */
    public Long extractUserId(String token) {
        return Long.parseLong(extractClaim(token, Claims::getSubject));
    }

    /**
     * Extract role from token
     */
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    /**
     * Extract email from token
     */
    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    /**
     * Extract expiration date from token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract a specific claim from token
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims from token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Check if token is expired
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Validate token
     * @return true if token is valid, false otherwise
     */
    public Boolean validateToken(String token) {
        try {
            // Verify signature and check if token is not expired
            return !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            // Token is expired
            return false;
        } catch (MalformedJwtException | SecurityException | IllegalArgumentException e) {
            // Token is invalid
            return false;
        }
    }
}