package com.nova_pioneers.parenting.service;

import com.nova_pioneers.parenting.repositories.CourseRepository;
import com.nova_pioneers.parenting.model.Course;
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
        // Calculate XP and assign level title
        calculateXpForCourse(course);
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    // --- XP Calculation Logic ---
    private void calculateXpForCourse(Course course) {
        int baseXp;

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

 
        int ageMultiplier = Math.max(1, course.getRecommendedAge() / 5);

        int finalXp = baseXp * ageMultiplier;
        course.setXpValue(finalXp);
    }

    // --- Assign Creative Title Based on XP ---
    private String assignXpTitle(int xp) {
        if (xp < 300) {
            return "Explorer";
        } else if (xp < 700) {
            return "Adventurer";
        } else if (xp < 1200) {
            return "Innovator";
        } else if (xp < 2000) {
            return "Astronaut";
        } else {
            return "Galaxy Master";
        }
    }
}
