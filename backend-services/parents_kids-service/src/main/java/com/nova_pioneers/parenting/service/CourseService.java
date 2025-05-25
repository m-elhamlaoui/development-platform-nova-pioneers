package com.nova_pioneers.parenting.service;

import com.nova_pioneers.parenting.repositories.CourseRepository;
import com.nova_pioneers.parenting.model.Course;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {
    private static final Logger log = LoggerFactory.getLogger(CourseService.class);

    private final CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        log.info("Getting all courses");
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        log.info("Getting course by ID: {}", id);
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByTeacher(Long teacherId) {
        log.info("Getting courses by teacher ID: {}", teacherId);
        return courseRepository.findByTeacherId(teacherId);
    }

    @Transactional
    public Course saveCourse(Course course) {
        log.info("Saving course: {}", course.getTitle());
        // Calculate XP and assign level title
        calculateXpForCourse(course);
        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        log.info("Deleting course with ID: {}", id);
        courseRepository.deleteById(id);
    }

    // --- XP Calculation Logic ---
    private void calculateXpForCourse(Course course) {
        int baseXp;

        // Size-based XP
        if (course.getSizeCategory() == null) {
            baseXp = 100;
        } else {
            switch (course.getSizeCategory().toUpperCase()) {
                case "S":
                    baseXp = 200;
                    break;
                case "M":
                    baseXp = 500;
                    break;
                case "L":
                    baseXp = 1000;
                    break;
                default:
                    baseXp = 100;
            }
        }

        // Calculate age multiplier (default to 1 if null)
        int ageMultiplier = (course.getRecommendedAge() != null) ? Math.max(1, course.getRecommendedAge() / 5) : 1;

        int finalXp = baseXp * ageMultiplier;
        course.setXpValue(finalXp);
        log.info("Calculated XP for course: {}", finalXp);
    }
}
