package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.model.Kidadd;
import com.nova_pioneers.parenting.model.Registerkid;
import com.nova_pioneers.parenting.repositories.Kidaddrepo;
import com.nova_pioneers.parenting.repositories.Registrationrepository;
import com.nova_pioneers.parenting.service.Registerkidservice;
import com.nova_pioneers.parenting.service.RatingandReportService;
import com.nova_pioneers.parenting.model.CourseRating;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class KidController {
    private static final Logger log = LoggerFactory.getLogger(KidController.class);

    private final Registrationrepository registrationrepository;
    private final Kidaddrepo kidaddrepo;
    private final Registerkidservice registerkidservice;
    private final RatingandReportService ratingService;

    @PostMapping(value = "/registerchild", consumes = "application/json")
    public ResponseEntity<Registerkid> createUser(@RequestBody Registerkid user) {
        try {
            log.info("Registering new child with email: {}", user.getEmail());
            return ResponseEntity.ok(registerkidservice.registerNewKid(user));
        } catch (Exception e) {
            log.error("Error registering child: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/allkids")
    public ResponseEntity<List<Kidadd>> getAllKids() {
        try {
            log.info("Fetching all kids");
            List<Kidadd> kids = kidaddrepo.findAll();
            return ResponseEntity.ok(kids);
        } catch (Exception e) {
            log.error("Error fetching kids: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/updatekid")
    public ResponseEntity<Kidadd> updatekid(@RequestBody Kidadd kid) {
        try {
            log.info("Updating kid with ID: {}", kid.getKidId());
            return ResponseEntity.ok(registerkidservice.update(kid));
        } catch (Exception e) {
            log.error("Error updating kid: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/deletekid/{id}")
    public ResponseEntity<String> deleteKid(@PathVariable("id") Long user_id) {
        try {
            log.info("Deleting kid with ID: {}", user_id);
            registerkidservice.deleteKid(user_id);
            return ResponseEntity.ok("kid deleted");
        } catch (Exception e) {
            log.error("Error deleting kid: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/testdb")
    public ResponseEntity<String> testDatabaseConnection() {
        try {
            log.info("Testing database connection");
            List<Kidadd> kids = kidaddrepo.findAll();
            return ResponseEntity.ok("Database connection successful. Found " + kids.size() + " kids.");
        } catch (Exception e) {
            log.error("Database connection failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Database connection failed: " + e.getMessage());
        }
    }

    @RequestMapping("/courses/{courseId}/ratings")
    public class RatingController {
        @GetMapping
        public ResponseEntity<List<CourseRating>> getRatingsByCourse(@PathVariable Long courseId) {
            try {
                return ResponseEntity.ok(ratingService.getRatingsByCourse(courseId));
            } catch (Exception e) {
                log.error("Error fetching ratings: {}", e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        @PostMapping
        public ResponseEntity<CourseRating> addRating(
                @PathVariable Long courseId, @RequestBody CourseRating rating) {
            try {
                return new ResponseEntity<>(ratingService.saveRating(rating, courseId), HttpStatus.CREATED);
            } catch (Exception e) {
                log.error("Error adding rating: {}", e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        }

        @DeleteMapping("/{ratingId}")
        public ResponseEntity<Void> deleteRating(@PathVariable Long ratingId) {
            try {
                ratingService.deleteRating(ratingId);
                return ResponseEntity.noContent().build();
            } catch (Exception e) {
                log.error("Error deleting rating: {}", e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
    }
}
