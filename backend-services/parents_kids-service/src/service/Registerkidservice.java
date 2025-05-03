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


import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class Registerkidservice implements UserDetailsService {
    
    @Autowired
    private Registrationrepository registrationrepository;

    @Override
    public UserDetails loadUserByUsername(String last_name) {
        
        Optional<Registerkid> user = registrationrepository.findByUsername(last_name);

        if (user.isPresent()) {
            var userObj= user.get();
            return  User.builder()
            .email(userObj.getEmail())
            .password(userObj.getPassword_hash())
            .roles(userObj.getRole())
            .firstname(userObj.getFirst_name())
            .build();
        }else{
            throw new UsernameNotFoundException(last_name);
        }
        

    
    }

}