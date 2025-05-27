package com.nova_pioneers.admin.services;

import com.nova_pioneers.admin.dto.CreateUserRequest;
import com.nova_pioneers.admin.dto.UserResponse;
import com.nova_pioneers.admin.entities.User;
import com.nova_pioneers.admin.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponse createUser(CreateUserRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with email " + request.getEmail() + " already exists");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole());
        user.setIsActive(request.getIsActive());

        // Hash the password
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // Save user
        User savedUser = userRepository.save(user);

        // Convert to response DTO
        return convertToResponse(savedUser);
    }

    public UserResponse createAdmin(String email, String firstName, String lastName, String password) {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail(email);
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setPassword(password);
        request.setRole("admin");
        request.setIsActive(true);

        return createUser(request);
    }

    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole());
        response.setIsActive(user.getIsActive());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}