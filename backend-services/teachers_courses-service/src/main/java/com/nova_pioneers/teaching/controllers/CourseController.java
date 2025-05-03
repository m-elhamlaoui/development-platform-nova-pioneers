package com.nova_pioneers.teaching.controllers;


import com.nova_pioneers.teaching.Service.CourseService;
import com.nova_pioneers.teaching.model.Course;
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

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Course>> getCoursesByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(courseService.getCoursesByTeacher(teacherId));
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        return new ResponseEntity<>(courseService.saveCourse(course), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        Optional<Course> existingCourse = courseService.getCourseById(id);

        if (existingCourse.isPresent()) {
            course.setId(id);
            return ResponseEntity.ok(courseService.saveCourse(course));
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
}
