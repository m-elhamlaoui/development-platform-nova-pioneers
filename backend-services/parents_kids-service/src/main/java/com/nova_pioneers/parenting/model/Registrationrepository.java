package com.nova_pioneers.parenting.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository

public interface Registrationrepository extends JpaRepository<Registerkid, Long> {
    // This method will be automatically implemented by Spring Data JPA
    Optional<Registerkid> findByEmail(String email);
}
