package com.nova_pioneers.parenting.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nova_pioneers.parenting.model.Kidadd;

import java.util.Optional;

@Repository
public interface Kidaddrepo extends JpaRepository<Kidadd, Long> {

    Optional<Kidadd> findByKidId(Long kidId);
}
