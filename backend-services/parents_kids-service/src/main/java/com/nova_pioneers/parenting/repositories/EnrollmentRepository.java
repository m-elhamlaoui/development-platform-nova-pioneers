package com.nova_pioneers.parenting.repositories;

import com.nova_pioneers.parenting.entities.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByUserId(Integer userId);

    Optional<Enrollment> findByUserIdAndCourseId(Integer userId, Integer courseId);

    Optional<Enrollment> findByEnrollmentIdAndUserId(Integer enrollmentId, Integer userId);

    boolean existsByUserIdAndCourseId(Integer userId, Integer courseId);
}