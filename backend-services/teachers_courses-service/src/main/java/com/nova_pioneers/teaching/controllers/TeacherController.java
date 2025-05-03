package com.nova_pioneers.teaching.controllers;

import com.nova_pioneers.teaching.Service.TeacherService;
import com.nova_pioneers.teaching.model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        Optional<Teacher> teacher = teacherService.getTeacherById(id);
        return teacher.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Teacher> createTeacher(@RequestBody Teacher teacher) {
        return new ResponseEntity<>(teacherService.saveTeacher(teacher), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teacher> updateTeacher(@PathVariable Long id, @RequestBody Teacher teacher) {
        Optional<Teacher> existingTeacher = teacherService.getTeacherById(id);

        if (existingTeacher.isPresent()) {
            teacher.setId(id);
            return ResponseEntity.ok(teacherService.saveTeacher(teacher));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/add-xp")
    public ResponseEntity<Void> addXpToTeacher(@PathVariable Long id, @RequestParam int xp) {
        Optional<Teacher> existingTeacher = teacherService.getTeacherById(id);

        if (existingTeacher.isPresent()) {
            teacherService.addXpToTeacher(id, xp);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
