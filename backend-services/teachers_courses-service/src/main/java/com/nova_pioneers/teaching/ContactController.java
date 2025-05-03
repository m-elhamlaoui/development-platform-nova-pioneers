package com.nova_pioneers.teaching;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<String> submitContactForm(@Valid @RequestBody ContactMessage contactMessage) {
        try {
            emailService.sendContactEmail(contactMessage);
            return ResponseEntity.ok("Your message has been sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send message: " + e.getMessage());
        }
    }
}
