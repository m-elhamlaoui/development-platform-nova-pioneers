package com.nova_pioneers.teaching.controllers;


import com.nova_pioneers.teaching.DTO.CourseDTO;
import com.nova_pioneers.teaching.Service.CourseService;

import com.nova_pioneers.teaching.model.Course;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/detailed")
    public ResponseEntity<List<CourseDTO>> getAllCoursesDetailed() {
        return ResponseEntity.ok(courseService.getAllCoursesDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/detailed")
    public ResponseEntity<CourseDTO> getCourseByIdDetailed(@PathVariable Long id) {
        Optional<CourseDTO> course = courseService.getCourseByIdDTO(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Course>> getCoursesByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(courseService.getCoursesByTeacher(teacherId));
    }

    @GetMapping("/teacher/{teacherId}/detailed")
    public ResponseEntity<List<CourseDTO>> getCoursesByTeacherDetailed(@PathVariable Long teacherId) {
        return ResponseEntity.ok(courseService.getCoursesByTeacherDTO(teacherId));
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        return new ResponseEntity<>(courseService.saveCourse(course), HttpStatus.CREATED);
    }

    @PostMapping("/detailed")
    public ResponseEntity<CourseDTO> createCourseDetailed(@Valid @RequestBody CourseDTO courseDTO) {
        return new ResponseEntity<>(courseService.saveCourseWithDetails(courseDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @Valid @RequestBody Course course) {
        Optional<Course> existingCourse = courseService.getCourseById(id);

        if (existingCourse.isPresent()) {
            course.setId(id);
            return ResponseEntity.ok(courseService.saveCourse(course));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/detailed")
    public ResponseEntity<CourseDTO> updateCourseDetailed(@PathVariable Long id, @Valid @RequestBody CourseDTO courseDTO) {
        Optional<Course> existingCourse = courseService.getCourseById(id);

        if (existingCourse.isPresent()) {
            courseDTO.setId(id);
            return ResponseEntity.ok(courseService.saveCourseWithDetails(courseDTO));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        Optional<Course> existingCourse = courseService.getCourseById(id);

        if (existingCourse.isPresent()) {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(courseService.searchCoursesByKeyword(keyword));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Course>> filterCourses(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String gradeLevel,
            @RequestParam(required = false) String sizeCategory,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge) {

        return ResponseEntity.ok(courseService.filterCourses(subject, gradeLevel, sizeCategory, minAge, maxAge));
    }
}

