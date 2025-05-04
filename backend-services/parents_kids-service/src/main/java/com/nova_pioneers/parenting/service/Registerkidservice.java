package com.nova_pioneers.parenting.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.nova_pioneers.parenting.model.Registrationrepository;
import com.nova_pioneers.parenting.model.Registerkid;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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


    public Registerkid registerNewKid(Registerkid userkid) {
       boolean userExists = registrationrepository
                            .findByEmail(userkid.getEmail())
                            .isPresent();
        if (userExists){
            throw new IllegalStateException("email taken");
        }
     
         String encodePaswword = bCryptPasswordEncoder
                .encode(userkid.getPassword_hash());
         
         userkid.setPassword_hash(encodePaswword);
         userkid.setRole("kid");
         userkid.setIs_active(true);
        return registrationrepository.save(userkid);
 
    }
}
