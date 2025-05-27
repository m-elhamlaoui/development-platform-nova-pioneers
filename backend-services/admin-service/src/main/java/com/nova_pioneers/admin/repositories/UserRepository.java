package com.nova_pioneers.admin.repositories;

import com.nova_pioneers.admin.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRoleAndIsActive(String role, Boolean isActive);
}