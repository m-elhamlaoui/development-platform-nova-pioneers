package com.nova_pioneers.teaching.Service;

import com.nova_pioneers.teaching.DTO.LessonDTO;
import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.Repositories.LessonRepository;
import com.nova_pioneers.teaching.Repositories.ModuleRepository;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Lesson;
import com.nova_pioneers.teaching.model.Module;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ModuleRepository moduleRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseMapperService mapperService;

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
    public List<Lesson> getLessonsByCourse(Long courseId) {
        return lessonRepository.findByCourseIdOrderBySequenceOrderAsc(courseId);
    }

    public List<LessonDTO> getLessonsByCourseDetailed(Long courseId) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceOrderAsc(courseId);
        return lessons.stream()
                .map(mapperService::mapToDTO)
                .collect(Collectors.toList());
    }

    public Lesson saveLessonForCourse(Lesson lesson, Long courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (!course.isPresent()) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }

        lesson.setCourse(course.get());
        return lessonRepository.save(lesson);
}}
