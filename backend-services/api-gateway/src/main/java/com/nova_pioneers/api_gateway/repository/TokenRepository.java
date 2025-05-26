package com.nova_pioneers.api_gateway.repository;

import com.nova_pioneers.api_gateway.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    /**
     * Find a token by its token string
     */
    Optional<Token> findByToken(String token);

    /**
     * Check if a token exists and is not revoked
     */
    boolean existsByTokenAndRevokedFalse(String token);
}