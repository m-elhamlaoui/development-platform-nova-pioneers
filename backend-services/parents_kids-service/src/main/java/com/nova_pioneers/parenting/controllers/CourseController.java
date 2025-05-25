package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.service.CourseService;
import com.nova_pioneers.parenting.model.Course;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {
    private static final Logger log = LoggerFactory.getLogger(CourseController.class);

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        try {
            log.info("Fetching all courses");
            return ResponseEntity.ok(courseService.getAllCourses());
        } catch (Exception e) {
            log.error("Error fetching courses: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{CourseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        try {
            log.info("Fetching course with ID: {}", id);
            Optional<Course> course = courseService.getCourseById(id);
            return course.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error fetching course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/createcourse")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        try {
            log.info("Creating new course: {}", course.getTitle());
            return new ResponseEntity<>(courseService.saveCourse(course), HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{CourseId}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        try {
            log.info("Updating course with ID: {}", id);
            Optional<Course> existingCourse = courseService.getCourseById(id);

            if (existingCourse.isPresent()) {
                course.setId(id);
                return ResponseEntity.ok(courseService.saveCourse(course));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error updating course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
