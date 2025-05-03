package com.nova_pioneers.teaching.Service;


import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByTeacher(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId);
    }

    public Course saveCourse(Course course) {
        // Calculate XP based on course size and age group
        calculateXpForCourse(course);
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    // Implement XP rules as per requirements
    private void calculateXpForCourse(Course course) {
        // Example XP calculation based on size and age
        int baseXp = 0;

        // Size-based XP
        switch(course.getSizeCategory().toUpperCase()) {
            case "S":
                baseXp = 200;
                break;
            case "M":
                baseXp = 500;
                break;
            case "L":
                baseXp = 1000;
                break;
            default:
                baseXp = 100;
        }

        // Age multiplier (older kids' courses are worth more XP)
        int ageMultiplier = Math.max(1, course.getRecommendedAge() / 5);

        course.setXpValue(baseXp * ageMultiplier);
    }
}
