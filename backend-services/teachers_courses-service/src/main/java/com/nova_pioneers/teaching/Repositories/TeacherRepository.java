package com.nova_pioneers.teaching.Repositories;


import com.nova_pioneers.teaching.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Teacher findByUsername(String username);
    Teacher findByEmail(String email);
}
