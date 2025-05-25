package com.nova_pioneers.parenting.repositories;

import com.nova_pioneers.parenting.entities.LessonContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonContentRepository extends JpaRepository<LessonContent, Integer> {
    List<LessonContent> findByLessonIdOrderBySequenceOrder(Integer lessonId);
}