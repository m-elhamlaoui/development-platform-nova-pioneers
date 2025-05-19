package com.nova_pioneers.auth.controllers;

import com.nova_pioneers.auth.services.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/token")
public class TokenController {
    private final TokenService tokenService;

    @Autowired
    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        boolean isValid = tokenService.validateToken(token).isPresent();

        Map<String, Boolean> response = new HashMap<>();
        response.put("valid", isValid);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/revoke")
    public ResponseEntity<Map<String, Boolean>> revokeToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        boolean revoked = tokenService.revokeToken(token);

        Map<String, Boolean> response = new HashMap<>();
        response.put("revoked", revoked);

        return ResponseEntity.ok(response);
    }
}
