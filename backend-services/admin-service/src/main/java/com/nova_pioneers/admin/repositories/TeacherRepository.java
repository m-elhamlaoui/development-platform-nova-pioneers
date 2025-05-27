package com.nova_pioneers.admin.repositories;

import com.nova_pioneers.admin.entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Teacher findByUserId(Integer userId);

    boolean existsByUserId(Integer userId);
}