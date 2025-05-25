package com.nova_pioneers.parenting.repositories;

import com.nova_pioneers.parenting.entities.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    Page<Rating> findByCourseIdOrderByRatedAtDesc(Integer courseId, Pageable pageable);
    
    Optional<Rating> findByUserIdAndCourseId(Integer userId, Integer courseId);
    
    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.courseId = :courseId")
    Double getAverageRatingByCourseId(@Param("courseId") Integer courseId);
    
    Long countByCourseId(Integer courseId);
}