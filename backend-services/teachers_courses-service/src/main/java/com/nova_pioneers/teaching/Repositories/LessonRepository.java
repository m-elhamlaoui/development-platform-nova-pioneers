package com.nova_pioneers.teaching.Repositories;

import com.nova_pioneers.teaching.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByModuleId(Long moduleId);
    List<Lesson> findByModuleIdOrderBySequenceOrder(Long moduleId);
}
