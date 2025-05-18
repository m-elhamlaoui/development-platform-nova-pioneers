package com.nova_pioneers.parenting.repositories;

import com.nova_pioneers.parenting.model.Enrollments;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollments, Long> {
    List<Enrollments> findByKidKidId(Long kidId);
    Optional<Enrollments> findByKidKidIdAndCourseId(Long kidId, Long courseId);
}
