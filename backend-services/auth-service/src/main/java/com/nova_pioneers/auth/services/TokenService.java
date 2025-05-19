package com.nova_pioneers.auth.services;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import com.nova_pioneers.auth.config.JwtConfig;
import com.nova_pioneers.auth.entities.Token;
import com.nova_pioneers.auth.entities.User;
import com.nova_pioneers.auth.repositories.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TokenService {
    private final TokenRepository tokenRepository;
    private final JwtConfig jwtConfig;
    private final Key key;

    @Autowired
    public TokenService(TokenRepository tokenRepository, JwtConfig jwtConfig) {
        this.tokenRepository = tokenRepository;
        this.jwtConfig = jwtConfig;
        this.key = Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtConfig.getExpiration());

        String jwtToken = Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("role", user.getRole())
                .claim("email", user.getEmail())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)  // Note: removed SignatureAlgorithm.HS512
                .compact();

        // Save token in the database
        Token token = new Token();
        token.setToken(jwtToken);
        token.setUser(user);
        token.setIssuedAt(now);
        token.setExpiresAt(expiryDate);
        token.setRevoked(false);

        tokenRepository.save(token);

        return jwtToken;
    }

    public Optional<User> validateToken(String token) {
        try {
            Claims claims = Jwts.parser()  // Changed from parserBuilder()
                    .verifyWith((SecretKey)key)  // Changed from setSigningKey
                    .build()
                    .parseSignedClaims(token)  // Changed from parseClaimsJws
                    .getPayload();  // Changed from getBody

            // Verify if token is revoked
            if (!tokenRepository.existsByTokenAndRevokedFalse(token)) {
                return Optional.empty();
            }

            Long userId = Long.parseLong(claims.getSubject());
            return Optional.of(new User(userId, null, null, null, null, (String) claims.get("role"), null, null, false, null, null));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public boolean revokeToken(String token) {
        Optional<Token> tokenEntity = tokenRepository.findByToken(token);
        if (tokenEntity.isPresent()) {
            Token t = tokenEntity.get();
            t.setRevoked(true);
            tokenRepository.save(t);
            return true;
        }
        return false;
    }

    @Transactional
    public void revokeAllUserTokens(User user) {
        List<Token> userTokens = tokenRepository.findByUser(user);
        userTokens.forEach(token -> token.setRevoked(true));
        tokenRepository.saveAll(userTokens);
    }
}
