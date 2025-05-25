package com.nova_pioneers.parenting.repositories;

import com.nova_pioneers.parenting.entities.Kid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KidRepository extends JpaRepository<Kid, Integer> {
    List<Kid> findByParentId(Integer parentId);

    Optional<Kid> findByUserIdAndParentId(Integer userId, Integer parentId);

    Optional<Kid> findByUserId(Integer userId);

    boolean existsByUserIdAndParentId(Integer userId, Integer parentId);
}