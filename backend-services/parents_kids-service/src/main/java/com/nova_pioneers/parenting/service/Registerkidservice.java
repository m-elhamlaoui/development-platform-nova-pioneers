package com.nova_pioneers.parenting.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nova_pioneers.parenting.model.Kidadd;
import com.nova_pioneers.parenting.model.Registerkid;
import com.nova_pioneers.parenting.repositories.Kidaddrepo;
import com.nova_pioneers.parenting.repositories.Registrationrepository;




@Service
public class Registerkidservice {

    private final Registrationrepository registrationrepository;

    @Autowired
    public Registerkidservice(Registrationrepository registrationrepository) {
        this.registrationrepository = registrationrepository;
    }

    @Autowired
     private Kidaddrepo kidaddrepo;


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
     
         userkid.setRole("kid");
         userkid.setIs_active(true);
      Registerkid savedUserkid = registrationrepository.save(userkid);
     

      Kidadd kid = new Kidadd();
       kid.setUser(savedUserkid); 
       kid.setIsRestricted(0);

       kidaddrepo.save(kid);

    return savedUserkid;
      
 
    }

    public String deleteKid(Long user_id) {
        registrationrepository.deleteById(user_id);
        return "kid deleted";
    }

    public Kidadd update(Kidadd kid){
        return kidaddrepo.save(kid);
    }
}
