package com.nova_pioneers.parenting.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;
import java.util.Optional;
import com.nova_pioneers.parenting.model.Registrationrepository;
import com.nova_pioneers.parenting.model.Registerkid;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class Registerkidservice implements UserDetailsService {

    private final Registrationrepository registrationrepository;

    @Autowired
    public Registerkidservice(Registrationrepository registrationrepository) {
        this.registrationrepository = registrationrepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Registerkid> user = registrationrepository.findByEmail(email);

        if (user.isPresent()) {
            Registerkid userObj = user.get();
            return User.builder()
                    .username(userObj.getEmail())
                    .password(userObj.getPassword_hash())
                    .roles(userObj.getRole())
                    .build();
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }
}
