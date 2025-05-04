package com.nova_pioneers.parenting.controllers;

import com.nova_pioneers.parenting.model.Registerkid;
import com.nova_pioneers.parenting.model.Registrationrepository;
import com.nova_pioneers.parenting.service.Registerkidservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RegisterController {

    @Autowired
    private Registrationrepository registrationrepository;

   @Autowired
       Registerkidservice registerkidservice;

   @PostMapping(value = "/registerchild", consumes = "application/json")
       public Registerkid createUser(@RequestBody Registerkid user) {
          return registerkidservice.registerNewKid(user);
}

    @GetMapping("/allkids")
    public List<Registerkid> getAllKids() {
        return registrationrepository.findAll();
    }
    @GetMapping("/testdb")
    public String testDatabaseConnection() {
        try {
            List<Registerkid> kids = registrationrepository.findAll();
            return "Database connection successful. Found " + kids.size() + " kids.";
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }
    @GetMapping("/test")
    public String testing() {
       return "hihihi its freaking working";
    }

}
