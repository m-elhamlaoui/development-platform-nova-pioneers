package com.nova_pioneers.auth.services;

import com.nova_pioneers.auth.dto.SigninRequest;
import com.nova_pioneers.auth.dto.SigninResponse;
import com.nova_pioneers.auth.entities.User;
import com.nova_pioneers.auth.exceptions.AuthenticationFailedException;
import com.nova_pioneers.auth.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, TokenService tokenService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    public SigninResponse authenticateUser(SigninRequest request) {
        User user = userRepository.findByEmail(request.getEmail());

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthenticationFailedException("Invalid email or password");
        }

        // Revoke any existing tokens for this user
        tokenService.revokeAllUserTokens(user);

        // Generate new token
        String token = tokenService.generateToken(user);

        return new SigninResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }
}
