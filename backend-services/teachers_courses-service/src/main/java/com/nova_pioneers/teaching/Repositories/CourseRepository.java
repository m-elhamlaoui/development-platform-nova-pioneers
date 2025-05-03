package com.nova_pioneers.teaching.Repositories;


import com.nova_pioneers.teaching.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherId(Long teacherId);
    List<Course> findBySubject(String subject);
    List<Course> findByGradeLevel(String gradeLevel);
}
