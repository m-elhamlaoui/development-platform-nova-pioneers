package com.nova_pioneers.teaching;

import com.nova_pioneers.teaching.DTO.ContentSectionDTO;
import com.nova_pioneers.teaching.DTO.CourseDTO;
import com.nova_pioneers.teaching.DTO.LessonDTO;
import com.nova_pioneers.teaching.Service.CourseMapperService;
import com.nova_pioneers.teaching.model.ContentSection;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Lesson;
import com.nova_pioneers.teaching.model.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class CourseMapperServiceTest {

    private CourseMapperService mapperService;
    private Course testCourse;
    private Teacher testTeacher;
    private List<Lesson> testLessons;
    private List<ContentSection> testContentSections;

    @BeforeEach
    void setUp() {
        mapperService = new CourseMapperService();

        // Create test teacher
        testTeacher = new Teacher();
        testTeacher.setId(1L);
        testTeacher.setFirstName("Professor");
        testTeacher.setLastName("Stella");

        // Create test course
        testCourse = new Course();
        testCourse.setId(1L);
        testCourse.setTitle("Space Adventure");
        testCourse.setDescription("Journey to the stars");
        testCourse.setThumbnail("/api/placeholder/800/600");
        testCourse.setSizeCategory("M");
        testCourse.setTeacher(testTeacher);

        // Create test content sections
        testContentSections = new ArrayList<>();
        ContentSection section1 = new ContentSection();
        section1.setId(1L);
        section1.setSubheading("Welcome to Space!");
        section1.setText("Explore the wonders of our universe");
        section1.setImage("/api/placeholder/600/400");
        section1.setSequenceOrder(1);
        testContentSections.add(section1);

        ContentSection section2 = new ContentSection();
        section2.setId(2L);
        section2.setFunFact("Did you know that one day on Venus is longer than one year on Venus?");
        section2.setSequenceOrder(2);
        testContentSections.add(section2);

        // Create test lessons
        testLessons = new ArrayList<>();
        Lesson lesson = new Lesson();
        lesson.setId(1L);
        lesson.setTitle("Introduction to Space");
        lesson.setImage("/api/placeholder/800/450");
        lesson.setSequenceOrder(1);
        lesson.setCourse(testCourse);
        lesson.setContentSections(testContentSections);
        testLessons.add(lesson);
    }

    @Test
    void testMapCourseToDTOWithLessons() {
        // Act
        CourseDTO dto = mapperService.mapToDTO(testCourse, testLessons);

        // Assert
        assertEquals(testCourse.getId(), dto.getId());
        assertEquals(testCourse.getTitle(), dto.getTitle());
        assertEquals(testCourse.getDescription(), dto.getDescription());
        assertEquals(testCourse.getThumbnail(), dto.getThumbnail());
        assertEquals(testCourse.getSizeCategory(), dto.getSize());
        assertEquals("Professor Stella", dto.getInstructor());

        // Check lessons
        assertNotNull(dto.getLessons());
        assertEquals(1, dto.getLessons().size());
        assertEquals("Introduction to Space", dto.getLessons().get(0).getTitle());

        // Check content sections in lessons
        List<ContentSectionDTO> contentSections = dto.getLessons().get(0).getContent();
        assertNotNull(contentSections);
        assertEquals(2, contentSections.size());
        assertEquals("Welcome to Space!", contentSections.get(0).getSubheading());
        assertEquals("Explore the wonders of our universe", contentSections.get(0).getText());
        assertNotNull(contentSections.get(1).getFunFact());
    }

    @Test
    void testMapLessonToDTO() {
        // Act
        LessonDTO dto = mapperService.mapToDTO(testLessons.get(0));

        // Assert
        assertEquals(testLessons.get(0).getId(), dto.getId());
        assertEquals(testLessons.get(0).getTitle(), dto.getTitle());
        assertEquals(testLessons.get(0).getImage(), dto.getImage());
        assertEquals(testLessons.get(0).getSequenceOrder(), dto.getSequenceOrder());

        // Check content sections
        assertNotNull(dto.getContent());
        assertEquals(2, dto.getContent().size());
    }

    @Test
    void testMapContentSectionToDTO() {
        // Act
        ContentSectionDTO dto = mapperService.mapToDTO(testContentSections.get(0));

        // Assert
        assertEquals(testContentSections.get(0).getId(), dto.getId());
        assertEquals(testContentSections.get(0).getSubheading(), dto.getSubheading());
        assertEquals(testContentSections.get(0).getText(), dto.getText());
        assertEquals(testContentSections.get(0).getImage(), dto.getImage());
        assertEquals(testContentSections.get(0).getSequenceOrder(), dto.getSequenceOrder());
    }

    @Test
    void testMapLessonDTOToEntity() {
        // Arrange
        LessonDTO lessonDTO = new LessonDTO();
        lessonDTO.setTitle("New Lesson");
        lessonDTO.setImage("/api/placeholder/new/450");
        lessonDTO.setSequenceOrder(2);

        // Act
        Lesson entity = mapperService.mapToEntity(lessonDTO, testCourse);

        // Assert
        assertEquals(lessonDTO.getTitle(), entity.getTitle());
        assertEquals(lessonDTO.getImage(), entity.getImage());
        assertEquals(lessonDTO.getSequenceOrder(), entity.getSequenceOrder());
        assertEquals(testCourse, entity.getCourse());
    }

    @Test
    void testMapContentSectionDTOToEntity() {
        // Arrange
        ContentSectionDTO sectionDTO = new ContentSectionDTO();
        sectionDTO.setSubheading("New Section");
        sectionDTO.setText("New content");
        sectionDTO.setImage("/api/placeholder/new/400");
        sectionDTO.setFunFact("Fun fact about space");
        sectionDTO.setSequenceOrder(3);

        Lesson lesson = testLessons.get(0);

        // Act
        ContentSection entity = mapperService.mapToEntity(sectionDTO, lesson);

        // Assert
        assertEquals(sectionDTO.getSubheading(), entity.getSubheading());
        assertEquals(sectionDTO.getText(), entity.getText());
        assertEquals(sectionDTO.getImage(), entity.getImage());
        assertEquals(sectionDTO.getFunFact(), entity.getFunFact());
        assertEquals(sectionDTO.getSequenceOrder(), entity.getSequenceOrder());
        assertEquals(lesson, entity.getLesson());
    }}
