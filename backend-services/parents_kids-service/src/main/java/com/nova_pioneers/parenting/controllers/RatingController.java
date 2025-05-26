package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.dto.*;
import com.nova_pioneers.parenting.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/courses")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    // 6.1. Rate a Course
    @PostMapping("/{courseId}/ratings")
    public ResponseEntity<RatingResponse> rateCourse(
            @PathVariable Integer courseId,
            @RequestBody CreateRatingRequest request) {

        // In real implementation, get user ID from JWT token
        Integer currentUserId = 1; // Mock for now

        RatingResponse response = ratingService.rateCourse(courseId, currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 6.2. Get Course Ratings (Paginated)
    @GetMapping("/{courseId}/ratings")
    public ResponseEntity<Page<RatingResponse>> getCourseRatings(
            @PathVariable Integer courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<RatingResponse> ratings = ratingService.getCourseRatings(courseId, pageable);
        return ResponseEntity.ok(ratings);
    }

    // 6.3. Get Course Rating Statistics
    @GetMapping("/{courseId}/ratings/stats")
    public ResponseEntity<RatingStatsResponse> getCourseRatingStats(@PathVariable Integer courseId) {
        RatingStatsResponse stats = ratingService.getCourseRatingStats(courseId);
        return ResponseEntity.ok(stats);
    }

    // 6.4. Update Own Rating
    @PutMapping("/{courseId}/ratings/me")
    public ResponseEntity<RatingResponse> updateOwnRating(
            @PathVariable Integer courseId,
            @RequestBody CreateRatingRequest request) {

        // In real implementation, get user ID from JWT token
        Integer currentUserId = 1; // Mock for now

        RatingResponse response = ratingService.updateRating(courseId, currentUserId, request);
        return ResponseEntity.ok(response);
    }

    // 6.5. Delete Own Rating
    @DeleteMapping("/{courseId}/ratings/me")
    public ResponseEntity<Void> deleteOwnRating(@PathVariable Integer courseId) {
        // In real implementation, get user ID from JWT token
        Integer currentUserId = 1; // Mock for now

        ratingService.deleteRating(courseId, currentUserId);
        return ResponseEntity.noContent().build();
    }
}