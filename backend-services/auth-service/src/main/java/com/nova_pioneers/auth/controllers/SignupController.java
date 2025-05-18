package com.nova_pioneers.auth.controllers;

import com.nova_pioneers.auth.dto.ParentSignupRequest;
import com.nova_pioneers.auth.dto.SignupResponse;
import com.nova_pioneers.auth.dto.TeacherSignupRequest;
import com.nova_pioneers.auth.entities.User;
import com.nova_pioneers.auth.services.SignupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/signup")
public class SignupController {
    private final SignupService signupService;

    @Autowired
    public SignupController(SignupService signupService) {
        this.signupService = signupService;
    }

    @PostMapping("/parent")
    public ResponseEntity<SignupResponse> registerParent(@RequestBody ParentSignupRequest request) {
        User user = signupService.registerParent(request);
        return ResponseEntity.ok(new SignupResponse(user.getId(), "Registration successful!"));
    }

    @PostMapping(value = "/teacher", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SignupResponse> registerTeacher(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "document", required = false) MultipartFile document) {

        TeacherSignupRequest request = new TeacherSignupRequest(
                firstName, lastName, email, password);

        User user = signupService.registerTeacher(request, document);
        return ResponseEntity.ok(
                new SignupResponse(user.getId(),
                        "Registration successful! Your account is pending review."));
    }
}
