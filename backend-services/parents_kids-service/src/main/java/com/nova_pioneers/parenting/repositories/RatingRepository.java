package com.nova_pioneers.parenting.repositories;

import com.nova_pioneers.parenting.model.CourseRating;
import com.nova_pioneers.parenting.model.Registerkid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<CourseRating, Long> {
    // Change this method to accept Registerkid instead of Long
    List<CourseRating> findByUserId(Registerkid userId);

    // OR add this method and keep the original one
    List<CourseRating> findByUserIdUser_id(Long userId);

    // Find by course ID
    List<CourseRating> findByCourseId(Long courseId);

    // Find by course
    List<CourseRating> findByCourse_CourseId(Long courseId);
}
