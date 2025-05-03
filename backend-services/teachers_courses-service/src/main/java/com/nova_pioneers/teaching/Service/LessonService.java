package com.nova_pioneers.teaching.Service;

import com.nova_pioneers.teaching.Repositories.LessonRepository;
import com.nova_pioneers.teaching.Repositories.ModuleRepository;
import com.nova_pioneers.teaching.model.Lesson;
import com.nova_pioneers.teaching.model.Module;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    public List<Lesson> getLessonsByModule(Long moduleId) {
        return lessonRepository.findByModuleIdOrderBySequenceOrder(moduleId);
    }

    public Optional<Lesson> getLessonById(Long id) {
        return lessonRepository.findById(id);
    }

    public Lesson saveLesson(Lesson lesson, Long moduleId) {
        Optional<Module> module = moduleRepository.findById(moduleId);
        if (!module.isPresent()) {
            throw new RuntimeException("Module not found with id: " + moduleId);
        }

        lesson.setModule(module.get());
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }
}
