package com.nova_pioneers.admin.services;

import com.nova_pioneers.admin.dto.ApproveTeacherRequest;
import com.nova_pioneers.admin.dto.PendingTeacherResponse;
import com.nova_pioneers.admin.dto.TeacherResponse;
import com.nova_pioneers.admin.entities.Teacher;
import com.nova_pioneers.admin.entities.User;
import com.nova_pioneers.admin.repositories.TeacherRepository;
import com.nova_pioneers.admin.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherApprovalService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public List<PendingTeacherResponse> getPendingTeachers() {
        List<User> pendingTeachers = userRepository.findByRoleAndIsActive("teacher", false);

        return pendingTeachers.stream()
                .map(this::convertToPendingTeacherResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TeacherResponse approveTeacher(Long userId, ApproveTeacherRequest request) {
        // Find the pending teacher user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Validate that user is a pending teacher
        if (!"teacher".equalsIgnoreCase(user.getRole()) || user.getIsActive()) {
            throw new RuntimeException("User is not a pending teacher");
        }

        // Check if teacher already exists in teachers table
        if (teacherRepository.existsByUserId(user.getUserId().intValue())) {
            throw new RuntimeException("Teacher already exists in teachers table");
        }

        // Activate the user
        user.setIsActive(true);
        userRepository.save(user);

        // Create teacher record
        Teacher teacher = new Teacher();
        teacher.setUserId(user.getUserId().intValue());
        teacher.setUsername(generateUsername(user.getFirstName(), user.getLastName()));
        teacher.setEmail(user.getEmail());
        teacher.setFirstName(user.getFirstName());
        teacher.setLastName(user.getLastName());
        teacher.setCertificationInfo(request.getCertificationInfo());
        teacher.setJoinDate(LocalDate.now());
        teacher.setAccumulatedXp(0);
        teacher.setTitle(request.getTitle() != null ? request.getTitle() : "Beginner");

        Teacher savedTeacher = teacherRepository.save(teacher);

        return convertToTeacherResponse(savedTeacher);
    }

    private String generateUsername(String firstName, String lastName) {
        String baseUsername = firstName.toLowerCase() + "_" + lastName.toLowerCase();
        return baseUsername.replaceAll("[^a-zA-Z0-9_]", "");
    }

    private PendingTeacherResponse convertToPendingTeacherResponse(User user) {
        PendingTeacherResponse response = new PendingTeacherResponse();
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    private TeacherResponse convertToTeacherResponse(Teacher teacher) {
        TeacherResponse response = new TeacherResponse();
        response.setId(teacher.getId());
        response.setUsername(teacher.getUsername());
        response.setEmail(teacher.getEmail());
        response.setFirstName(teacher.getFirstName());
        response.setLastName(teacher.getLastName());
        response.setUserId(teacher.getUserId());
        response.setCertificationInfo(teacher.getCertificationInfo());
        response.setJoinDate(teacher.getJoinDate());
        response.setAccumulatedXp(teacher.getAccumulatedXp());
        response.setTitle(teacher.getTitle());
        return response;
    }
}