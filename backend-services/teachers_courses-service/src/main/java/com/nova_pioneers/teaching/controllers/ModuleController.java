package com.nova_pioneers.teaching.controllers;

import com.nova_pioneers.teaching.Service.ModuleService;
import com.nova_pioneers.teaching.model.Module;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses/{courseId}/modules")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @GetMapping
    public ResponseEntity<List<Module>> getModulesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(moduleService.getModulesByCourse(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(@PathVariable Long id) {
        Optional<Module> module = moduleService.getModuleById(id);
        return module.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Module> createModule(
            @PathVariable Long courseId,
            @Valid @RequestBody Module module) {
        return new ResponseEntity<>(moduleService.saveModule(module, courseId), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Module> updateModule(
            @PathVariable Long courseId,
            @PathVariable Long id,
            @Valid @RequestBody Module module) {

        Optional<Module> existingModule = moduleService.getModuleById(id);

        if (existingModule.isPresent()) {
            module.setId(id);
            return ResponseEntity.ok(moduleService.saveModule(module, courseId));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }
}
