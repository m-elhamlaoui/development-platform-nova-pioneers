package com.nova_pioneers.teaching;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nova_pioneers.teaching.DTO.ContentSectionDTO;
import com.nova_pioneers.teaching.DTO.CourseDTO;
import com.nova_pioneers.teaching.DTO.LessonDTO;
import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.Repositories.TeacherRepository;
import com.nova_pioneers.teaching.model.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = BackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class DetailedCourseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CourseRepository courseRepository;

    private Teacher testTeacher;
    private CourseDTO testCourseDTO;

    @BeforeEach
    void setUp() {
        // Create and save test teacher
        testTeacher = new Teacher();
        testTeacher.setUsername("space_teacher");
        testTeacher.setEmail("space@example.com");
        testTeacher.setFirstName("Professor");
        testTeacher.setLastName("Stella");
        testTeacher.setJoinDate(LocalDate.now());
        testTeacher.setAccumulatedXp(1000);
        testTeacher.setTitle("Space Expert");

        testTeacher = teacherRepository.save(testTeacher);

        // Create test course DTO
        testCourseDTO = new CourseDTO();
        testCourseDTO.setTitle("Space Adventure");
        testCourseDTO.setDescription("Journey to the stars");
        testCourseDTO.setThumbnail("/api/placeholder/800/600");
        testCourseDTO.setSize("M");
        testCourseDTO.setInstructor("Professor Stella");

        // Create lessons
        List<LessonDTO> lessons = new ArrayList<>();

        LessonDTO lesson1 = new LessonDTO();
        lesson1.setTitle("Introduction to Space");
        lesson1.setImage("/api/placeholder/800/450");
        lesson1.setSequenceOrder(1);

        List<ContentSectionDTO> contentSections1 = new ArrayList<>();

        ContentSectionDTO section1 = new ContentSectionDTO();
        section1.setSubheading("Welcome to Space!");
        section1.setText("Explore the wonders of our universe");
        section1.setImage("/api/placeholder/600/400");
        section1.setSequenceOrder(1);
        contentSections1.add(section1);

        ContentSectionDTO section2 = new ContentSectionDTO();
        section2.setFunFact("Did you know that one day on Venus is longer than one year on Venus?");
        section2.setSequenceOrder(2);
        contentSections1.add(section2);

        lesson1.setContent(contentSections1);
        lessons.add(lesson1);

        LessonDTO lesson2 = new LessonDTO();
        lesson2.setTitle("The Solar System");
        lesson2.setImage("/api/placeholder/800/450");
        lesson2.setSequenceOrder(2);

        List<ContentSectionDTO> contentSections2 = new ArrayList<>();

        ContentSectionDTO section3 = new ContentSectionDTO();
        section3.setSubheading("Our Planetary Neighbors");
        section3.setText("Learn about the eight planets in our solar system");
        section3.setImage("/api/placeholder/600/400");
        section3.setSequenceOrder(1);
        contentSections2.add(section3);

        lesson2.setContent(contentSections2);
        lessons.add(lesson2);

        testCourseDTO.setLessons(lessons);
    }

    @Test
    void testCompleteDetailedCourseFlow() throws Exception {
        // 1. Create a detailed course
        String courseJson = objectMapper.writeValueAsString(testCourseDTO);
        String courseResult = mockMvc.perform(post("/api/courses/detailed")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(courseJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Space Adventure")))
                .andExpect(jsonPath("$.lessons", hasSize(2)))
                .andExpect(jsonPath("$.lessons[0].title", is("Introduction to Space")))
                // Just check that content exists and is not empty
                .andExpect(jsonPath("$.lessons[0].content").exists())
                .andExpect(jsonPath("$.lessons[1].title", is("The Solar System")))
                .andReturn().getResponse().getContentAsString();

        // Extract course ID from response
        CourseDTO createdCourse = objectMapper.readValue(courseResult, CourseDTO.class);
        Long courseId = createdCourse.getId();

        // 2. Get the detailed course by ID
        mockMvc.perform(get("/api/courses/" + courseId + "/detailed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Space Adventure")))
                .andExpect(jsonPath("$.lessons", hasSize(2)))
                .andExpect(jsonPath("$.lessons[0].content[0].subheading", is("Welcome to Space!")))
                .andExpect(jsonPath("$.lessons[0].content[1].funFact", containsString("Venus")));



        LessonDTO newLesson = new LessonDTO();
        newLesson.setTitle("Space Travel");
        newLesson.setImage("/api/placeholder/800/450");
        newLesson.setSequenceOrder(3);

        List<ContentSectionDTO> newContentSections = new ArrayList<>();
        ContentSectionDTO newSection = new ContentSectionDTO();
        newSection.setSubheading("Rockets and Spaceships");
        newSection.setText("How humans travel through space");
        newSection.setSequenceOrder(1);
        newContentSections.add(newSection);

        newLesson.setContent(newContentSections);
        createdCourse.getLessons().add(newLesson);

        // Change title
        createdCourse.setTitle("Advanced Space Adventure");

        mockMvc.perform(put("/api/courses/" + courseId + "/detailed")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createdCourse)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Advanced Space Adventure")))
                .andExpect(jsonPath("$.lessons", hasSize(3)))
                .andExpect(jsonPath("$.lessons[2].title", is("Space Travel")));

        // 4. Get all detailed courses
        mockMvc.perform(get("/api/courses/detailed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].title", is("Advanced Space Adventure")))
                .andExpect(jsonPath("$[0].lessons", hasSize(3)));
    }
}