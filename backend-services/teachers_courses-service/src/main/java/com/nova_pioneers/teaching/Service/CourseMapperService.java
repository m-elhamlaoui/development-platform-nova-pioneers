package com.nova_pioneers.teaching.Service;
import com.nova_pioneers.teaching.DTO.ContentSectionDTO;
import com.nova_pioneers.teaching.DTO.CourseDTO;
import com.nova_pioneers.teaching.DTO.LessonDTO;
import com.nova_pioneers.teaching.model.ContentSection;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Lesson;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

        // Make sure content sections are properly initialized in the entity
        if (lesson.getContentSections() == null) {
            lesson.setContentSections(new ArrayList<>());
        }

        // Convert the content sections to DTOs
        List<ContentSectionDTO> contentSectionDTOs = lesson.getContentSections().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        // Initialize the content list in the DTO
        dto.setContent(contentSectionDTOs);

        return dto;
    }

    public ContentSectionDTO mapToDTO(ContentSection section) {
        ContentSectionDTO dto = new ContentSectionDTO();
        dto.setId(section.getId());
        dto.setSubheading(section.getSubheading());
        dto.setText(section.getText());
        dto.setImage(section.getImage());
        dto.setFunFact(section.getFunFact());
        dto.setSequenceOrder(section.getSequenceOrder());
        return dto;
    }

    // Entity mapping methods

    public Lesson mapToEntity(LessonDTO dto, Course course) {
        Lesson lesson = new Lesson();
        lesson.setTitle(dto.getTitle());
        lesson.setImage(dto.getImage());
        lesson.setSequenceOrder(dto.getSequenceOrder());
        lesson.setCourse(course);
        return lesson;
    }

    public ContentSection mapToEntity(ContentSectionDTO dto, Lesson lesson) {
        ContentSection section = new ContentSection();
        section.setSubheading(dto.getSubheading());
        section.setText(dto.getText());
        section.setImage(dto.getImage());
        section.setFunFact(dto.getFunFact());
        section.setSequenceOrder(dto.getSequenceOrder());
        section.setLesson(lesson);
        return section;
    }

}