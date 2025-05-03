package com.nova_pioneers.parenting.controllers;

import org.springframework.web.bind.annotation.RequestBody;
import com.nova_pioneers.parenting.model.Registerkid;
import com.nova_pioneers.parenting.model.Registrationrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class RegisterController {

@Autowired
private Registrationrepository registrationrepository;

    
@PostMapping(value="/registerchild", consumes ="application/json")
   public Registerkid createUser(@RequestBody Registerkid user){
        return registrationrepository.save(user);
    }

}