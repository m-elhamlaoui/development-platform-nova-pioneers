package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.model.Kidadd;
import com.nova_pioneers.parenting.model.Registerkid;
import com.nova_pioneers.parenting.repositories.Kidaddrepo;
import com.nova_pioneers.parenting.repositories.Registrationrepository;
import com.nova_pioneers.parenting.service.Registerkidservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.nova_pioneers.parenting.model.CourseRating;
import com.nova_pioneers.parenting.service.RatingandReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
public class KidController {

    @Autowired
    private Registrationrepository registrationrepository;

    @Autowired
    private Kidaddrepo kidaddrepo;
    

   @Autowired
       Registerkidservice registerkidservice;

   @PostMapping(value = "/registerchild", consumes = "application/json")
       public Registerkid createUser(@RequestBody Registerkid user) {
          return registerkidservice.registerNewKid(user);
}


   @GetMapping("/allkids")
     public List<Kidadd> getAllKids() {
      List<Kidadd> kids = kidaddrepo.findAll();  
     return kids; 
}


    @PutMapping("/updatekid")
      public Kidadd updatekid(@RequestBody Kidadd kid){
          return registerkidservice.update(kid);
      }


    @DeleteMapping("/deletekid/{id}")
     public String deleteKid(@PathVariable("id") Long user_id){
         registerkidservice.deleteKid(user_id);
         return "kid deleted";
       
     }


   @RequestMapping("/courses/{courseId}/ratings")
       public class RatingController {

    @Autowired
    private RatingandReportService ratingService;

    @GetMapping
    public ResponseEntity<List<CourseRating>> getRatingsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(ratingService.getRatingsByCourse(courseId));
    }

    @PostMapping
    public ResponseEntity<CourseRating> addRating(
            @PathVariable Long courseId, @RequestBody CourseRating rating) {
        return new ResponseEntity<>(ratingService.saveRating(rating, courseId), HttpStatus.CREATED);
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.noContent().build();
    }
}



    @GetMapping("/testdb")
    public String testDatabaseConnection() {
        try {
            List<Kidadd> kids = kidaddrepo.findAll();
            return "Database connection successful. Found " + kids.size() + " kids.";
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }
    

}
