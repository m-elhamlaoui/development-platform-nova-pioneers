package com.nova_pioneers.teaching.Repositories;

import com.nova_pioneers.teaching.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByModuleId(Long moduleId);
    List<Lesson> findByModuleIdOrderBySequenceOrder(Long moduleId);
    List<Lesson> findByCourseIdOrderBySequenceOrderAsc(Long courseId);
    @Query("SELECT DISTINCT l FROM Lesson l LEFT JOIN FETCH l.contentSections WHERE l.course.id = :courseId ORDER BY l.sequenceOrder ASC")
    List<Lesson> findByCourseIdWithContentSections(@Param("courseId") Long courseId);

}
