package com.nova_pioneers.parenting.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.nova_pioneers.parenting.model.Kidadd;
import com.nova_pioneers.parenting.model.Registerkid;
import com.nova_pioneers.parenting.repositories.Kidaddrepo;
import com.nova_pioneers.parenting.repositories.Registrationrepository;

import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class Registerkidservice {
    private static final Logger log = LoggerFactory.getLogger(Registerkidservice.class);

    private final Registrationrepository registrationrepository;
    private final Kidaddrepo kidaddrepo;

    public Registerkid findUserByEmail(String email) {
        return registrationrepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public boolean authenticate(String email, String rawPassword) {
        Registerkid user = findUserByEmail(email);
        return rawPassword.equals(user.getPassword_hash());
    }

    @Transactional
    public Registerkid registerNewKid(Registerkid userkid) {
        boolean userExists = registrationrepository
                .findByEmail(userkid.getEmail())
                .isPresent();
        if (userExists) {
            log.error("Email already taken: {}", userkid.getEmail());
            throw new IllegalStateException("email taken");
        }

        userkid.setRole("kid");
        userkid.setIs_active(true);
        Registerkid savedUserkid = registrationrepository.save(userkid);
        log.info("Registered new kid with ID: {}", savedUserkid.getUser_id());

        Kidadd kid = new Kidadd();
        kid.setUser(savedUserkid);
        kid.setIsRestricted(0);
        kidaddrepo.save(kid);
        log.info("Created kid profile with ID: {}", kid.getKidId());

        return savedUserkid;
    }

    @Transactional
    public String deleteKid(Long user_id) {
        log.info("Deleting kid with user ID: {}", user_id);
        registrationrepository.deleteById(user_id);
        return "kid deleted";
    }

    public Kidadd update(Kidadd kid) {
        log.info("Updating kid with ID: {}", kid.getKidId());
        return kidaddrepo.save(kid);
    }
}
