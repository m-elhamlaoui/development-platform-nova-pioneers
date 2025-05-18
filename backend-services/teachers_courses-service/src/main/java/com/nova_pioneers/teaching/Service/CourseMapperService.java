package com.nova_pioneers.teaching.Service;


import com.nova_pioneers.teaching.DTO.ContentSectionDTO;
import com.nova_pioneers.teaching.DTO.CourseDTO;
import com.nova_pioneers.teaching.DTO.LessonDTO;
import com.nova_pioneers.teaching.model.ContentSection;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Lesson;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseMapperService {

    public CourseDTO mapToDTO(Course course, List<Lesson> lessons) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setThumbnail(course.getThumbnail());
        dto.setInstructor(course.getInstructorName());
        dto.setSize(course.getSizeCategory());
        dto.setRating(course.getAverageRating());
        dto.setReviews(course.getReviewCount());

        if (lessons != null && !lessons.isEmpty()) {
            List<LessonDTO> lessonDTOs = lessons.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
            dto.setLessons(lessonDTOs);
        }

        return dto;
    }

    public LessonDTO mapToDTO(Lesson lesson) {
        LessonDTO dto = new LessonDTO();
        dto.setId(lesson.getId());
        dto.setTitle(lesson.getTitle());
        dto.setImage(lesson.getImage());
        dto.setSequenceOrder(lesson.getSequenceOrder());

        if (lesson.getContentSections() != null && !lesson.getContentSections().isEmpty()) {
            List<ContentSectionDTO> contentSectionDTOs = lesson.getContentSections().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
            dto.setContent(contentSectionDTOs);
        }

        return dto;
    }}