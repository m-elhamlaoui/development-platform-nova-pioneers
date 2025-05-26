package com.nova_pioneers.parenting.service;

import com.nova_pioneers.parenting.dto.*;
import com.nova_pioneers.parenting.entities.*;
import com.nova_pioneers.parenting.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    public RatingResponse rateCourse(Integer courseId, Integer userId, CreateRatingRequest request) {
        // Verify course exists
        courseRepository.findByIdAndIsActiveTrue(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if user already rated this course
        if (ratingRepository.findByUserIdAndCourseId(userId, courseId).isPresent()) {
            throw new RuntimeException("User has already rated this course");
        }

        Rating rating = new Rating();
        rating.setCourseId(courseId);
        rating.setUserId(userId);
        rating.setRatingValue(request.getRatingValue());
        rating.setComment(request.getComment());
        rating.setUserType(request.getUserType());
        rating.setRatedAt(LocalDateTime.now());

        Rating savedRating = ratingRepository.save(rating);
        return mapToRatingResponse(savedRating);
    }

    public Page<RatingResponse> getCourseRatings(Integer courseId, Pageable pageable) {
        Page<Rating> ratings = ratingRepository.findByCourseIdOrderByRatedAtDesc(courseId, pageable);
        return ratings.map(this::mapToRatingResponse);
    }

    public RatingStatsResponse getCourseRatingStats(Integer courseId) {
        Double averageRating = ratingRepository.getAverageRatingByCourseId(courseId);
        Long totalRatings = ratingRepository.countByCourseId(courseId);

        return new RatingStatsResponse(
                averageRating != null ? averageRating : 0.0,
                totalRatings);
    }

    public RatingResponse updateRating(Integer courseId, Integer userId, CreateRatingRequest request) {
        Rating rating = ratingRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        rating.setRatingValue(request.getRatingValue());
        rating.setComment(request.getComment());
        rating.setUserType(request.getUserType());
        rating.setRatedAt(LocalDateTime.now());

        Rating savedRating = ratingRepository.save(rating);
        return mapToRatingResponse(savedRating);
    }

    public void deleteRating(Integer courseId, Integer userId) {
        Rating rating = ratingRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        ratingRepository.delete(rating);
    }

    private RatingResponse mapToRatingResponse(Rating rating) {
        User user = userRepository.findById(rating.getUserId()).orElse(null);

        RatingResponse response = new RatingResponse();
        response.setId(rating.getId());
        response.setUserId(rating.getUserId());
        response.setUserName(user != null ? user.getFirstName() + " " + user.getLastName() : "Unknown User");
        response.setRatingValue(rating.getRatingValue());
        response.setComment(rating.getComment());
        response.setUserType(rating.getUserType());
        response.setRatedAt(rating.getRatedAt().toString());
        return response;
    }
}