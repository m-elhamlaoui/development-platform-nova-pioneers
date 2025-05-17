package com.nova_pioneers.parenting.model;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;




@Repository

public interface Registrationrepository extends CrudRepository<Registerkid, Long> {
    
    Optional<Registerkid> findByEmail(String email);
    
}



