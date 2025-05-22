package com.nova_pioneers.auth.repositories;

import com.nova_pioneers.auth.entities.Token;
import com.nova_pioneers.auth.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    List<Token> findByUser(User user);
    Optional<Token> findByToken(String token);
    boolean existsByTokenAndRevokedFalse(String token);
}
