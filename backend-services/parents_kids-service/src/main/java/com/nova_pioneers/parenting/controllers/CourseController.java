package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.service.CourseService;
import com.nova_pioneers.parenting.model.Course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{CourseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Course> createCourse (@RequestBody Course course) {
        return new ResponseEntity<>(courseService.saveCourse(course), HttpStatus.CREATED);
    }


    @PutMapping("/{CourseId}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        Optional<Course> existingCourse = courseService.getCourseById(id);

        if (existingCourse.isPresent()) {
            course.setId(id);
            return ResponseEntity.ok(courseService.saveCourse(course));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
