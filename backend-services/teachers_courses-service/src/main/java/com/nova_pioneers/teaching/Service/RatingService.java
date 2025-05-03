package com.nova_pioneers.teaching.Service;

import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.Repositories.RatingRepository;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Rating;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<Rating> getRatingsByCourse(Long courseId) {
        return ratingRepository.findByCourseId(courseId);
    }

    public Rating saveRating(Rating rating, Long courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (!course.isPresent()) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }

        rating.setCourse(course.get());
        return ratingRepository.save(rating);
    }

    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }
}
