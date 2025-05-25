package com.nova_pioneers.parenting.repositories;

import com.nova_pioneers.parenting.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUserIdAndIsActive(Integer userId, Boolean isActive);

    @Query("SELECT u FROM User u WHERE u.userId IN :userIds AND u.isActive = true")
    List<User> findAllByUserIdsAndActive(@Param("userIds") List<Integer> userIds);
}