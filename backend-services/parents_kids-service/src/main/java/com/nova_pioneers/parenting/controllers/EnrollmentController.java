package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.dto.*;
import com.nova_pioneers.parenting.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kids")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    // 5.1. Enroll in a Course
    @PostMapping("/{kidUserId}/enrollments")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(
            @PathVariable Integer kidUserId,
            @RequestBody EnrollmentRequest request) {

        EnrollmentResponse response = enrollmentService.enrollInCourse(kidUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 5.2. Get All Enrollments for a Kid
    @GetMapping("/{kidUserId}/enrollments")
    public ResponseEntity<List<EnrollmentResponse>> getAllEnrollments(@PathVariable Integer kidUserId) {
        List<EnrollmentResponse> enrollments = enrollmentService.getAllEnrollments(kidUserId);
        return ResponseEntity.ok(enrollments);
    }

    // 5.3. Get Specific Enrollment Details
    @GetMapping("/{kidUserId}/enrollments/{enrollmentId}")
    public ResponseEntity<EnrollmentResponse> getEnrollmentDetails(
            @PathVariable Integer kidUserId,
            @PathVariable Integer enrollmentId) {

        EnrollmentResponse response = enrollmentService.getEnrollmentDetails(kidUserId, enrollmentId);
        return ResponseEntity.ok(response);
    }

    // 5.4. Update Course Progress
    @PutMapping("/{kidUserId}/enrollments/{enrollmentId}/progress")
    public ResponseEntity<EnrollmentResponse> updateCourseProgress(
            @PathVariable Integer kidUserId,
            @PathVariable Integer enrollmentId,
            @RequestBody ProgressUpdateRequest request) {

        EnrollmentResponse response = enrollmentService.updateCourseProgress(kidUserId, enrollmentId, request);
        return ResponseEntity.ok(response);
    }

    // 5.5. Mark Course as Completed
    @PatchMapping("/{kidUserId}/enrollments/{enrollmentId}/complete")
    public ResponseEntity<EnrollmentResponse> markCourseCompleted(
            @PathVariable Integer kidUserId,
            @PathVariable Integer enrollmentId) {

        EnrollmentResponse response = enrollmentService.markCourseCompleted(kidUserId, enrollmentId);
        return ResponseEntity.ok(response);
    }
}