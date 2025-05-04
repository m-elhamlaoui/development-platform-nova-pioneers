package com.nova_pioneers.parenting.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.nova_pioneers.parenting.model.Registrationrepository;
import com.nova_pioneers.parenting.model.Registerkid;

import java.util.Optional;

@Service
public class Registerkidservice {

    private final Registrationrepository registrationrepository;

    @Autowired
    public Registerkidservice(Registrationrepository registrationrepository) {
        this.registrationrepository = registrationrepository;
    }

    public Registerkid findUserByEmail(String email) {
        return registrationrepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public boolean authenticate(String email, String rawPassword) {
        Registerkid user = findUserByEmail(email);
        return rawPassword.equals(user.getPassword_hash()); 
    }
}
