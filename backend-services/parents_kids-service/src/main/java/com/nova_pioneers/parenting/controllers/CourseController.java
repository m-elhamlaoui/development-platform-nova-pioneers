package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.dto.CourseResponse;
import com.nova_pioneers.parenting.dto.CourseDetailResponse;
import com.nova_pioneers.parenting.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CourseController {

    @Autowired
    private CourseService courseService;

    // 4.1. List Available Courses for a Kid
    @GetMapping("/kids/{kidUserId}/courses")
    public ResponseEntity<List<CourseResponse>> getCoursesForKid(
            @PathVariable Integer kidUserId,
            @RequestParam(required = false) String gradeLevel,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "0") Integer limit) {

        List<CourseResponse> courses = courseService.getCoursesForKid(kidUserId, gradeLevel, subject, search);

        // Apply limit if specified
        if (limit > 0 && limit < courses.size()) {
            courses = courses.subList(0, limit);
        }

        return ResponseEntity.ok(courses);
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getAllCourses(
            @RequestParam(required = false) String gradeLevel,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "0") Integer limit) {

        List<CourseResponse> courses = courseService.getAllCourses();

        // Apply limit if specified
        if (limit > 0 && limit < courses.size()) {
            courses = courses.subList(0, limit);
        }

        return ResponseEntity.ok(courses);
    }

    // 4.2. Get Specific Course Details
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseDetailResponse> getCourseDetails(@PathVariable Integer courseId) {
        CourseDetailResponse response = courseService.getCourseDetails(courseId);
        return ResponseEntity.ok(response);
    }
}