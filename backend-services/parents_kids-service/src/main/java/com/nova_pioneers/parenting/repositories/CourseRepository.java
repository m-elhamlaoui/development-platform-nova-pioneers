package com.nova_pioneers.parenting.repositories;

import com.nova_pioneers.parenting.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
    List<Course> findByIsActiveTrue();

    @Query("SELECT c FROM Course c WHERE c.isActive = true AND " +
            "(:gradeLevel IS NULL OR c.gradeLevel = :gradeLevel) AND " +
            "(:subject IS NULL OR c.subject = :subject) AND " +
            "(:search IS NULL OR c.title LIKE %:search% OR c.description LIKE %:search%)")
    List<Course> findCoursesWithFilters(@Param("gradeLevel") String gradeLevel,
            @Param("subject") String subject,
            @Param("search") String search);

    Optional<Course> findByIdAndIsActiveTrue(Integer id);
}