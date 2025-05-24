package com.nova_pioneers.teaching.controllers;

import com.nova_pioneers.teaching.DTO.LessonDTO;
import com.nova_pioneers.teaching.Service.LessonService;
import com.nova_pioneers.teaching.model.Lesson;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/modules/{moduleId}/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping
    public ResponseEntity<List<Lesson>> getLessonsByModule(@PathVariable Long moduleId) {
        return ResponseEntity.ok(lessonService.getLessonsByModule(moduleId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long id) {
        Optional<Lesson> lesson = lessonService.getLessonById(id);
        return lesson.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Lesson> createLesson(
            @PathVariable Long moduleId,
            @Valid @RequestBody Lesson lesson) {
        return new ResponseEntity<>(lessonService.saveLesson(lesson, moduleId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lesson> updateLesson(
            @PathVariable Long moduleId,
            @PathVariable Long id,
            @Valid @RequestBody Lesson lesson) {

        Optional<Lesson> existingLesson = lessonService.getLessonById(id);

        if (existingLesson.isPresent()) {
            lesson.setId(id);
            return ResponseEntity.ok(lessonService.saveLesson(lesson, moduleId));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> getLessonsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourse(courseId));
    }

    @GetMapping("/courses/{courseId}/lessons/detailed")
    public ResponseEntity<List<LessonDTO>> getLessonsByCourseDetailed(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourseDetailed(courseId));
    }

    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<Lesson> createLessonForCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody Lesson lesson) {
        return new ResponseEntity<>(lessonService.saveLessonForCourse(lesson, courseId), HttpStatus.CREATED);
    }
}
