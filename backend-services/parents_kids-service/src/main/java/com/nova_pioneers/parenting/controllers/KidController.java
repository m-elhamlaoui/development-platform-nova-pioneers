package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.dto.*;
import com.nova_pioneers.parenting.service.KidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kids")
public class KidController {

    @Autowired
    private KidService kidService;

    // 2.1. Get Kid's Own Profile Details
    @GetMapping("/{kidUserId}/profile")
    public ResponseEntity<KidResponse> getKidProfile(@PathVariable Integer kidUserId) {
        KidResponse response = kidService.getKidProfile(kidUserId);
        return ResponseEntity.ok(response);
    }

    // 2.2. Update Kid's Own Profile (Limited Fields)
    @PutMapping("/{kidUserId}/profile")
    public ResponseEntity<KidResponse> updateKidProfile(
            @PathVariable Integer kidUserId,
            @RequestBody KidUpdateRequest request) {
        KidResponse response = kidService.updateKidProfile(kidUserId, request);
        return ResponseEntity.ok(response);
    }
}