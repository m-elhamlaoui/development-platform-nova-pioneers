package com.nova_pioneers.teaching.controllers;

import com.nova_pioneers.teaching.Service.RatingService;
import com.nova_pioneers.teaching.model.Rating;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses/{courseId}/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @GetMapping
    public ResponseEntity<List<Rating>> getRatingsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(ratingService.getRatingsByCourse(courseId));
    }

    @PostMapping
    public ResponseEntity<Rating> addRating(
            @PathVariable Long courseId,
            @Valid @RequestBody Rating rating) {
        return new ResponseEntity<>(ratingService.saveRating(rating, courseId), HttpStatus.CREATED);
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.noContent().build();
    }
}
