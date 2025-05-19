package com.nova_pioneers.auth.controllers;

import com.nova_pioneers.auth.dto.SigninRequest;
import com.nova_pioneers.auth.dto.SigninResponse;
import com.nova_pioneers.auth.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signin")
    public ResponseEntity<SigninResponse> authenticateUser(@RequestBody SigninRequest request) {
        SigninResponse response = authService.authenticateUser(request);
        return ResponseEntity.ok(response);
    }
}