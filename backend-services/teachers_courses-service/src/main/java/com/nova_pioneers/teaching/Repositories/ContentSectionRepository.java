package com.nova_pioneers.teaching.Repositories;

import com.nova_pioneers.teaching.model.ContentSection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContentSectionRepository extends JpaRepository<ContentSection, Long> {
    List<ContentSection> findByLessonIdOrderBySequenceOrderAsc(Long lessonId);
}
