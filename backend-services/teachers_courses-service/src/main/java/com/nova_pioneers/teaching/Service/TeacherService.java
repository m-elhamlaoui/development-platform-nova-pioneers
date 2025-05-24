package com.nova_pioneers.teaching.Service;


import com.nova_pioneers.teaching.Repositories.TeacherRepository;
import com.nova_pioneers.teaching.model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> getTeacherById(Long id) {
        return teacherRepository.findById(id);
    }

    public Teacher saveTeacher(Teacher teacher) {
        // Set default title for new teachers
        if (teacher.getId() == null && teacher.getTitle() == null) {
            teacher.setTitle("Beginner Teacher");
            teacher.setAccumulatedXp(0);
        }

        return teacherRepository.save(teacher);
    }

    // Method to update teacher title based on accumulated XP
    public void updateTeacherTitle(Teacher teacher) {
        int xp = teacher.getAccumulatedXp();

        // Update title based on XP thresholds
        if (xp >= 10000) {
            teacher.setTitle("Great Teacher");
        } else if (xp >= 5000) {
            teacher.setTitle("Super Teacher");
        } else if (xp >= 1000) {
            teacher.setTitle("Experienced Teacher");
        } else {
            teacher.setTitle("Beginner Teacher");
        }

        teacherRepository.save(teacher);
    }

    // Method to add XP to teacher when their courses are completed
    public void addXpToTeacher(Long teacherId, int xpToAdd) {
        Optional<Teacher> teacher = teacherRepository.findById(teacherId);

        if (teacher.isPresent()) {
            Teacher teacherEntity = teacher.get();
            teacherEntity.setAccumulatedXp(teacherEntity.getAccumulatedXp() + xpToAdd);

            // Update title based on new XP
            updateTeacherTitle(teacherEntity);

            teacherRepository.save(teacherEntity);
        }
    }
}
