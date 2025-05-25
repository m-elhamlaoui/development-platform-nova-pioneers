package com.nova_pioneers.parenting.service;

import com.nova_pioneers.parenting.dto.UserResponse;
import com.nova_pioneers.parenting.dto.UserUpdateRequest;
import com.nova_pioneers.parenting.entities.User;
import com.nova_pioneers.parenting.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponse getUserInfo(Integer userId) {
        User user = userRepository.findByUserIdAndIsActive(userId, true)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    public UserResponse updateUserInfo(Integer userId, UserUpdateRequest request) {
        User user = userRepository.findByUserIdAndIsActive(userId, true)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole().name());
        response.setProfilePicture(user.getProfilePicture());
        response.setCreatedAt(user.getCreatedAt().toString());
        response.setIsActive(user.getIsActive());
        return response;
    }
}