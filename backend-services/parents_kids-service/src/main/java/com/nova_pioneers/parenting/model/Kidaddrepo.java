package com.nova_pioneers.parenting.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface Kidaddrepo extends JpaRepository<Kidadd, Long> {

    Optional<Kidadd> findByKidId(Long kid_id);
}

