package com.nova_pioneers.parenting.service;

import com.nova_pioneers.parenting.dto.KidResponse;
import com.nova_pioneers.parenting.dto.KidUpdateRequest;
import com.nova_pioneers.parenting.entities.Kid;
import com.nova_pioneers.parenting.entities.User;
import com.nova_pioneers.parenting.repositories.KidRepository;
import com.nova_pioneers.parenting.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class KidService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KidRepository kidRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public KidResponse getKidProfile(Integer kidUserId) {
        User user = userRepository.findByUserIdAndIsActive(kidUserId, true)
                .orElseThrow(() -> new RuntimeException("Kid not found"));

        Kid kid = kidRepository.findByUserId(kidUserId)
                .orElseThrow(() -> new RuntimeException("Kid profile not found"));

        return mapToKidResponse(user, kid);
    }

    public KidResponse updateKidProfile(Integer kidUserId, KidUpdateRequest request) {
        User user = userRepository.findByUserIdAndIsActive(kidUserId, true)
                .orElseThrow(() -> new RuntimeException("Kid not found"));

        Kid kid = kidRepository.findByUserId(kidUserId)
                .orElseThrow(() -> new RuntimeException("Kid profile not found"));

        // Update allowed fields for kids
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(user);
        return mapToKidResponse(savedUser, kid);
    }

    private KidResponse mapToKidResponse(User user, Kid kid) {
        KidResponse response = new KidResponse();
        response.setUserId(user.getUserId());
        response.setKidId(kid.getKidId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole());
        response.setProfilePicture(user.getProfilePicture());
        response.setCreatedAt(user.getCreatedAt().toString());
        response.setIsActive(user.getIsActive());
        response.setBirthDate(kid.getBirthDate() != null ? kid.getBirthDate().toString() : null);
        response.setTitle(kid.getTitle());
        response.setTotalXp(kid.getTotalXp());
        response.setIsRestricted(kid.getIsRestricted());
        response.setParentId(kid.getParentId());
        return response;
    }
}