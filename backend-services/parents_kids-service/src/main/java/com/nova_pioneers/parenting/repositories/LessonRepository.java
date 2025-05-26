package com.nova_pioneers.parenting.repositories;

import com.nova_pioneers.parenting.entities.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {
    List<Lesson> findByCourseIdOrderBySequenceOrder(Integer courseId);
}