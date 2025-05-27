package com.nova_pioneers.admin.controllers;

import com.nova_pioneers.admin.dto.ApproveTeacherRequest;
import com.nova_pioneers.admin.dto.PendingTeacherResponse;
import com.nova_pioneers.admin.dto.TeacherResponse;
import com.nova_pioneers.admin.services.TeacherApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/teachers")
public class TeacherApprovalController {

    @Autowired
    private TeacherApprovalService teacherApprovalService;

    @GetMapping("/pending")
    public ResponseEntity<List<PendingTeacherResponse>> getPendingTeachers() {
        try {
            List<PendingTeacherResponse> pendingTeachers = teacherApprovalService.getPendingTeachers();
            return ResponseEntity.ok(pendingTeachers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/approve/{userId}")
    public ResponseEntity<TeacherResponse> approveTeacher(
            @PathVariable Long userId,
            @RequestBody ApproveTeacherRequest request) {
        try {
            TeacherResponse response = teacherApprovalService.approveTeacher(userId, request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}