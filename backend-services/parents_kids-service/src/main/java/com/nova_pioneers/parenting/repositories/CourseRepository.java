package com.nova_pioneers.parenting.repositories;

import java.util.Optional;

import com.nova_pioneers.parenting.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

   Optional<Course> findById(Long courseId);


    // Find all courses by teacher ID
    List<Course> findByTeacherId(Long teacherId);

    // Search courses by subject
    List<Course> findBySubjectContainingIgnoreCase(String subject);

    // Filter by recommended age
    List<Course> findByRecommendedAgeBetween(Integer minAge, Integer maxAge);

    // Search by title
    List<Course> findByTitleContainingIgnoreCase(String keyword);
}
