package com.nova_pioneers.parenting.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nova_pioneers.parenting.model.Registerkid;

import java.util.Optional;

@Repository

public interface Registrationrepository extends JpaRepository<Registerkid, Long> {

    Optional<Registerkid> findByEmail(String email);
}