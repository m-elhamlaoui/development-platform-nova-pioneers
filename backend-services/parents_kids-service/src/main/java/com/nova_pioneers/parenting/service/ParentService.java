package com.nova_pioneers.parenting.service;

import com.nova_pioneers.parenting.dto.*;
import com.nova_pioneers.parenting.entities.Kid;
import com.nova_pioneers.parenting.entities.User;
import com.nova_pioneers.parenting.repositories.KidRepository;
import com.nova_pioneers.parenting.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ParentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KidRepository kidRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public KidResponse createKidProfile(Integer parentId, CreateKidRequest request) {
        // Check if parentId is null
        if (parentId == null) {
            throw new IllegalArgumentException("Parent ID cannot be null");
        }

        User parent = userRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent with ID " + parentId + " not found"));

        // Verify parent has proper role - USING STRING COMPARISON
        if (!"parent".equals(parent.getRole())) {
            throw new RuntimeException(
                    "User with ID " + parentId + " is not a parent. Current role: " + parent.getRole());
        }

        // Continue with kid creation
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole("kid"); // Set role to "kid"
        user.setProfilePicture(request.getProfilePicture());
        user.setCreatedAt(LocalDateTime.now());
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        Kid kid = new Kid();
        kid.setUserId(savedUser.getUserId());
        kid.setBirthDate(LocalDate.parse(request.getBirthDate()));
        kid.setTitle("Space Newby");
        kid.setTotalXp(0);
        // In ParentService.java
        kid.setIsRestricted(request.getIsRestricted() != null ? request.getIsRestricted() : 0);
        kid.setParentId(parentId);

        Kid savedKid = kidRepository.save(kid);
        return mapToKidResponse(savedUser, savedKid);
    }

    public List<KidResponse> getAllKidsForParent(Integer parentId) {
        List<Kid> kids = kidRepository.findByParentId(parentId);
        List<Integer> userIds = kids.stream().map(Kid::getUserId).collect(Collectors.toList());
        List<User> users = userRepository.findAllByUserIdsAndActive(userIds);

        return kids.stream()
                .map(kid -> {
                    User user = users.stream()
                            .filter(u -> u.getUserId().equals(kid.getUserId()))
                            .findFirst()
                            .orElse(null);
                    return mapToKidResponse(user, kid);
                })
                .collect(Collectors.toList());
    }

    public KidResponse updateKidProfile(Integer parentId, Integer kidUserId, UpdateKidRequest request) {
        // Verify kid belongs to parent
        Optional<Kid> kidOpt = kidRepository.findByUserIdAndParentId(kidUserId, parentId);
        if (kidOpt.isEmpty()) {
            throw new RuntimeException("Kid not found or doesn't belong to this parent");
        }

        Kid kid = kidOpt.get();
        User user = userRepository.findById(kidUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update User fields
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }

        // Update Kid fields
        if (request.getBirthDate() != null) {
            kid.setBirthDate(LocalDate.parse(request.getBirthDate()));
        }

        User savedUser = userRepository.save(user);
        Kid savedKid = kidRepository.save(kid);

        return mapToKidResponse(savedUser, savedKid);
    }

    public ToggleRestrictionResponse toggleKidRestriction(Integer parentId, Integer kidUserId,
            ToggleRestrictionRequest request) {
        // Verify kid belongs to parent
        Optional<Kid> kidOpt = kidRepository.findByUserIdAndParentId(kidUserId, parentId);
        if (kidOpt.isEmpty()) {
            throw new RuntimeException("Kid not found or doesn't belong to this parent");
        }

        Kid kid = kidOpt.get();
        kid.setIsRestricted(request.getIsRestricted());
        kidRepository.save(kid);

        return new ToggleRestrictionResponse(
                kidUserId,
                kid.getKidId(),
                "Kid's restriction status updated.",
                request.getIsRestricted());
    }

    public void deleteKidProfile(Integer parentId, Integer kidUserId) {
        // Verify kid belongs to parent
        if (!kidRepository.existsByUserIdAndParentId(kidUserId, parentId)) {
            throw new RuntimeException("Kid not found or doesn't belong to this parent");
        }

        // Logical delete - set user as inactive
        User user = userRepository.findById(kidUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
    }

    private KidResponse mapToKidResponse(User user, Kid kid) {
        if (user == null || kid == null) {
            return null;
        }

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