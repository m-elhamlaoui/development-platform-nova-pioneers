package com.nova_pioneers.admin.controllers;

import com.nova_pioneers.admin.dto.CreateUserRequest;
import com.nova_pioneers.admin.dto.UserResponse;
import com.nova_pioneers.admin.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @PostMapping("/create-user")
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        try {
            UserResponse response = userService.createUser(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/create-admin")
    public ResponseEntity<UserResponse> createAdmin(@RequestBody CreateUserRequest request) {
        try {
            UserResponse response = userService.createAdmin(
                    request.getEmail(),
                    request.getFirstName(),
                    request.getLastName(),
                    request.getPassword());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}