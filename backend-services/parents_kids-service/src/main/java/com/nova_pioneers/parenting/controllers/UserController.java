package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.dto.UserResponse;
import com.nova_pioneers.parenting.dto.UserUpdateRequest;
import com.nova_pioneers.parenting.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // 3.1. Get Own User Information
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getOwnUserInfo() {
        // In real implementation, you'd get user ID from JWT token
        Integer currentUserId = 1; // Mock for now
        UserResponse response = userService.getUserInfo(currentUserId);
        return ResponseEntity.ok(response);
    }

    // 3.2. Update Own User Information
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateOwnUserInfo(@RequestBody UserUpdateRequest request) {
        // In real implementation, you'd get user ID from JWT token
        Integer currentUserId = 1; // Mock for now
        UserResponse response = userService.updateUserInfo(currentUserId, request);
        return ResponseEntity.ok(response);
    }
}