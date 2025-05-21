package com.nova_pioneers.teaching;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.Repositories.ModuleRepository;
import com.nova_pioneers.teaching.Repositories.TeacherRepository;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Module;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = BackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class CourseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ModuleRepository moduleRepository;

    private Teacher testTeacher;
    private Course testCourse;

    @BeforeEach
    void setUp() {
        // Create a test teacher
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        testTeacher = new Teacher();
        testTeacher.setUsername("integration_teacher");
        testTeacher.setEmail("integration@example.com");
        testTeacher.setFirstName("Integration");
        testTeacher.setLastName("Test");
        testTeacher.setJoinDate(LocalDate.now());
        testTeacher.setAccumulatedXp(0);
        testTeacher.setTitle("Beginner Teacher");

        testTeacher = teacherRepository.save(testTeacher);

        // Create a test course
        testCourse = new Course();
        testCourse.setTitle("Integration Course");
        testCourse.setDescription("Integration Test Description");
        testCourse.setGradeLevel("Elementary");
        testCourse.setSubject("Space");
        testCourse.setCreatedDate(LocalDate.now()); // Use LocalDate instead of Date
        testCourse.setXpValue(500);
        testCourse.setSizeCategory("M");
        testCourse.setRecommendedAge(8);
        testCourse.setTeacher(testTeacher); // Use setTeacher instead of setTeacherId
    }

    @Test
    void fullCourseCreationFlow() throws Exception {
        // 1. Create a course
        String courseJson = objectMapper.writeValueAsString(testCourse);
        String courseResult = mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(courseJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Integration Course")))
                .andReturn().getResponse().getContentAsString();

        // Extract course ID from response
        Course createdCourse = objectMapper.readValue(courseResult, Course.class);
        Long courseId = createdCourse.getId();

        // 2. Create a module for the course
        Module module = new Module();
        module.setTitle("Integration Module");
        module.setDescription("Integration Module Description");
        module.setSequenceOrder(1);

        mockMvc.perform(post("/api/courses/" + courseId + "/modules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(module)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Integration Module")));

        // 3. Get all modules for the course
        mockMvc.perform(get("/api/courses/" + courseId + "/modules"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Integration Module")));

        // 4. Update the course
        testCourse.setId(courseId);
        testCourse.setTitle("Updated Integration Course");

        mockMvc.perform(put("/api/courses/" + courseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCourse)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Updated Integration Course")));

        // 5. Filter courses
        mockMvc.perform(get("/api/courses/filter")
                        .param("subject", "Space")
                        .param("gradeLevel", "Elementary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.title=='Updated Integration Course')]", hasSize(1)));
    }
}