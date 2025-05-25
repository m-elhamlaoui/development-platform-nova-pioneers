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

        enrollment.setCompletedAt(LocalDateTime.now());
        enrollment.setProgressPercentage(100);

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        Course course = courseRepository.findById(enrollment.getCourseId()).orElse(null);
        return mapToEnrollmentResponse(savedEnrollment, course);
    }

    private EnrollmentResponse mapToEnrollmentResponse(Enrollment enrollment, Course course) {
        EnrollmentResponse response = new EnrollmentResponse();
        response.setEnrollmentId(enrollment.getEnrollmentId());
        response.setCourseId(enrollment.getCourseId());
        response.setCourseTitle(course != null ? course.getTitle() : "Unknown Course");
        response.setEnrolledAt(enrollment.getEnrolledAt().toString());
        response.setCompletedAt(enrollment.getCompletedAt() != null ? enrollment.getCompletedAt().toString() : null);
        response.setProgressPercentage(enrollment.getProgressPercentage());
        response.setXpEarned(enrollment.getXpEarned());
        response.setLastCompletedLessonId(enrollment.getLastCompletedLessonId());
        return response;
    }
}