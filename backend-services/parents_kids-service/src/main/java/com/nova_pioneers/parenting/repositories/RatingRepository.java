package com.nova_pioneers.parenting.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nova_pioneers.parenting.model.CourseRating;

import java.util.Optional;


@Repository
public interface RatingRepository extends JpaRepository<CourseRating, Long> {
    Optional<CourseRating> findByUserIdAndCourseId(Long userId, Long courseId);
}
