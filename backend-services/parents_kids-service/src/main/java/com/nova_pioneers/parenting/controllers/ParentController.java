package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.dto.*;
import com.nova_pioneers.parenting.service.ParentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parents")
public class ParentController {

    @Autowired
    private ParentService parentService;

    // 1.1. Create a Kid Profile
    @PostMapping("/{parentId}/kids")
    public ResponseEntity<KidResponse> createKidProfile(
            @PathVariable Integer parentId,
            @RequestBody CreateKidRequest request) {
        
        KidResponse response = parentService.createKidProfile(parentId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 1.2. Get All Kids for a Parent
    @GetMapping("/{parentId}/kids")
    public ResponseEntity<List<KidResponse>> getAllKidsForParent(@PathVariable Integer parentId) {
        
        List<KidResponse> kids = parentService.getAllKidsForParent(parentId);
        return ResponseEntity.ok(kids);
    }

    // 1.3. Update a Kid's Profile (by Parent)
    @PutMapping("/{parentId}/kids/{kidUserId}")
    public ResponseEntity<KidResponse> updateKidProfile(
            @PathVariable Integer parentId,
            @PathVariable Integer kidUserId,
            @RequestBody UpdateKidRequest request) {
        
        KidResponse response = parentService.updateKidProfile(parentId, kidUserId, request);
        return ResponseEntity.ok(response);
    }

    // 1.4. Toggle Kid's Restriction Status
    @PatchMapping("/{parentId}/kids/{kidUserId}/toggle-restriction")
    public ResponseEntity<ToggleRestrictionResponse> toggleKidRestriction(
            @PathVariable Integer parentId,
            @PathVariable Integer kidUserId,
            @RequestBody ToggleRestrictionRequest request) {
        
        ToggleRestrictionResponse response = parentService.toggleKidRestriction(parentId, kidUserId, request);
        return ResponseEntity.ok(response);
    }

    // 1.5. Delete a Kid Profile (Logical Delete Recommended)
    @DeleteMapping("/{parentId}/kids/{kidUserId}")
    public ResponseEntity<DeleteKidResponse> deleteKidProfile(
            @PathVariable Integer parentId,
            @PathVariable Integer kidUserId) {
        
        parentService.deleteKidProfile(parentId, kidUserId);
        
        // Return 200 OK with confirmation message as shown in documentation
        DeleteKidResponse response = new DeleteKidResponse(
                "Kid profile for user ID " + kidUserId + " marked as inactive."
        );

        return ResponseEntity.ok(response);
    }
}