package com.nova_pioneers.teaching.Repositories;


import com.nova_pioneers.teaching.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherId(Long teacherId);

    List<Course> findBySubject(String subject);

    List<Course> findByGradeLevel(String gradeLevel);

    List<Course> findBySizeCategory(String sizeCategory);

    List<Course> findByRecommendedAge(Integer age);

    @Query("SELECT c FROM Course c WHERE c.title LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Course> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT c FROM Course c WHERE " +
            "(:subject IS NULL OR c.subject = :subject) AND " +
            "(:gradeLevel IS NULL OR c.gradeLevel = :gradeLevel) AND " +
            "(:sizeCategory IS NULL OR c.sizeCategory = :sizeCategory) AND " +
            "(:minAge IS NULL OR c.recommendedAge >= :minAge) AND " +
            "(:maxAge IS NULL OR c.recommendedAge <= :maxAge)")
    List<Course> filterCourses(
            @Param("subject") String subject,
            @Param("gradeLevel") String gradeLevel,
            @Param("sizeCategory") String sizeCategory,
            @Param("minAge") Integer minAge,
            @Param("maxAge") Integer maxAge);
}
