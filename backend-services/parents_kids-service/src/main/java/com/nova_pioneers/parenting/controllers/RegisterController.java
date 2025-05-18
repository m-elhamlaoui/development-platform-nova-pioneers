package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.model.Kidadd;
import com.nova_pioneers.parenting.model.Registerkid;
import com.nova_pioneers.parenting.repositories.Kidaddrepo;
import com.nova_pioneers.parenting.repositories.Registrationrepository;
import com.nova_pioneers.parenting.service.Registerkidservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
public class RegisterController {

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
