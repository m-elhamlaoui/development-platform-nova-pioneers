package com.nova_pioneers.parenting.service;

import com.nova_pioneers.parenting.dto.*;
import com.nova_pioneers.parenting.entities.*;
import com.nova_pioneers.parenting.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private KidRepository kidRepository;

    public EnrollmentResponse enrollInCourse(Integer kidUserId, EnrollmentRequest request) {
        // Verify kid exists
        kidRepository.findByUserId(kidUserId)
                .orElseThrow(() -> new RuntimeException("Kid not found"));

        // Verify course exists
        Course course = courseRepository.findByIdAndIsActiveTrue(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if already enrolled
        if (enrollmentRepository.existsByUserIdAndCourseId(kidUserId, request.getCourseId())) {
            throw new RuntimeException("Already enrolled in this course");
        }

        // Create enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(kidUserId);
        enrollment.setCourseId(request.getCourseId());
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setProgressPercentage(0);
        enrollment.setXpEarned(0);

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return mapToEnrollmentResponse(savedEnrollment, course);
    }

    public List<EnrollmentResponse> getAllEnrollments(Integer kidUserId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(kidUserId);

        return enrollments.stream()
                .map(enrollment -> {
                    Course course = courseRepository.findById(enrollment.getCourseId()).orElse(null);
                    return mapToEnrollmentResponse(enrollment, course);
                })
                .collect(Collectors.toList());
    }

    public EnrollmentResponse getEnrollmentDetails(Integer kidUserId, Integer enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findByEnrollmentIdAndUserId(enrollmentId, kidUserId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        Course course = courseRepository.findById(enrollment.getCourseId()).orElse(null);
        return mapToEnrollmentResponse(enrollment, course);
    }

    public EnrollmentResponse updateCourseProgress(Integer kidUserId, Integer enrollmentId,
            ProgressUpdateRequest request) {
        Enrollment enrollment = enrollmentRepository.findByEnrollmentIdAndUserId(enrollmentId, kidUserId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        if (request.getLastCompletedLessonId() != null) {
            enrollment.setLastCompletedLessonId(request.getLastCompletedLessonId());
        }
        if (request.getProgressPercentage() != null) {
            enrollment.setProgressPercentage(request.getProgressPercentage());
        }
        if (request.getXpEarned() != null) {
            enrollment.setXpEarned(request.getXpEarned());

            // Update kid's total XP
            Kid kid = kidRepository.findByUserId(kidUserId).orElse(null);
            if (kid != null) {
                kid.setTotalXp(kid.getTotalXp() + request.getXpEarned());
                kidRepository.save(kid);
            }
        }

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        Course course = courseRepository.findById(enrollment.getCourseId()).orElse(null);
        return mapToEnrollmentResponse(savedEnrollment, course);
    }

    public EnrollmentResponse markCourseCompleted(Integer kidUserId, Integer enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findByEnrollmentIdAndUserId(enrollmentId, kidUserId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        // Get the course to determine XP value
        Course course = courseRepository.findById(enrollment.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        enrollment.setCompletedAt(LocalDateTime.now());
        enrollment.setProgressPercentage(100);

        // Award XP if not already awarded
        if (enrollment.getXpEarned() == null || enrollment.getXpEarned() == 0) {
            Integer courseXp = course.getXpValue() != null ? course.getXpValue() : 0;
            enrollment.setXpEarned(courseXp);

            // Update kid's total XP
            Kid kid = kidRepository.findByUserId(kidUserId)
                    .orElseThrow(() -> new RuntimeException("Kid not found"));

            Integer currentTotalXp = kid.getTotalXp() != null ? kid.getTotalXp() : 0;
            kid.setTotalXp(currentTotalXp + courseXp);

            // Update title based on new XP
            updateKidTitle(kid);

            kidRepository.save(kid);
        }

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return mapToEnrollmentResponse(savedEnrollment, course);
    }

    // Helper method to update kid's title based on XP
    private void updateKidTitle(Kid kid) {
        Integer totalXp = kid.getTotalXp() != null ? kid.getTotalXp() : 0;

        if (totalXp >= 2000) {
            kid.setTitle("🌟 Master Explorer");
        } else if (totalXp >= 1500) {
            kid.setTitle("🏆 Champion Pioneer");
        } else if (totalXp >= 1000) {
            kid.setTitle("💎 Expert Adventurer");
        } else if (totalXp >= 750) {
            kid.setTitle("🚀 Space Pioneer");
        } else if (totalXp >= 500) {
            kid.setTitle("🔥 Advanced Explorer");
        } else if (totalXp >= 300) {
            kid.setTitle("⭐ Rising Star");
        } else if (totalXp >= 150) {
            kid.setTitle("🌱 Growing Pioneer");
        } else if (totalXp >= 50) {
            kid.setTitle("🎯 Junior Explorer");
        } else {
            kid.setTitle("🌟 New Pioneer");
        }
    }

    private EnrollmentResponse mapToEnrollmentResponse(Enrollment enrollment, Course course) {
        EnrollmentResponse response = new EnrollmentResponse();
        response.setEnrollmentId(enrollment.getEnrollmentId());
        response.setCourseId(enrollment.getCourseId());
        response.setCourseTitle(course != null ? course.getTitle() : "Unknown Course");
        response.setEnrolledAt(enrollment.getEnrolledAt().toString());
        response.setCompletedAt(enrollment.getCompletedAt() != null ? enrollment.getCompletedAt().toString() : null);
        response.setProgressPercentage(enrollment.getProgressPercentage());
        response.setXpEarned(enrollment.getXpEarned() != null ? enrollment.getXpEarned() : 0);
        response.setLastCompletedLessonId(enrollment.getLastCompletedLessonId());
        return response;
    }
}