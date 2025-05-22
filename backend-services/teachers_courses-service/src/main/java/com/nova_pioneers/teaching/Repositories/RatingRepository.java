package com.nova_pioneers.teaching.Repositories;

import com.nova_pioneers.teaching.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByCourseId(Long courseId);
    List<Rating> findByUserId(Long userId);
}
