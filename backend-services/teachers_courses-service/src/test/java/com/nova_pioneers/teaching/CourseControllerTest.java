package com.nova_pioneers.teaching;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.nova_pioneers.teaching.Service.CourseService;
import com.nova_pioneers.teaching.controllers.CourseController;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Teacher;
import static org.mockito.ArgumentMatchers.any;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class CourseControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private CourseService courseService;

    @InjectMocks
    private CourseController courseController;

    private Course testCourse;
    private Teacher testTeacher;

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        mockMvc = MockMvcBuilders.standaloneSetup(courseController).build();


        testTeacher = new Teacher();
        testTeacher.setId(1L);
        testTeacher.setUsername("test_teacher");
        testTeacher.setEmail("test@example.com");
        testTeacher.setFirstName("Test");
        testTeacher.setLastName("Teacher");
        testTeacher.setJoinDate(LocalDate.now());
        testTeacher.setAccumulatedXp(0);
        testTeacher.setTitle("Beginner Teacher");

        testCourse = new Course();
        testCourse.setId(1L);
        testCourse.setTitle("Test Course");
        testCourse.setDescription("Test Description");
        testCourse.setGradeLevel("Elementary");
        testCourse.setSubject("Space");
        testCourse.setCreatedDate(LocalDate.now());
        testCourse.setXpValue(500);
        testCourse.setSizeCategory("M");
        testCourse.setRecommendedAge(8);
        testCourse.setTeacher(testTeacher);
    }

    @Test
    void shouldGetAllCourses() throws Exception {
        when(courseService.getAllCourses()).thenReturn(List.of(testCourse));

        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Test Course")));

        verify(courseService, times(1)).getAllCourses();
    }

    @Test
    void shouldGetCourseById() throws Exception {
        when(courseService.getCourseById(1L)).thenReturn(Optional.of(testCourse));

        mockMvc.perform(get("/api/courses/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Test Course")));

        verify(courseService, times(1)).getCourseById(1L);
    }

    @Test
    void shouldReturn404WhenGetCourseByInvalidId() throws Exception {
        when(courseService.getCourseById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/courses/99"))
                .andExpect(status().isNotFound());

        verify(courseService, times(1)).getCourseById(99L);
    }

    @Test
    void shouldCreateCourse() throws Exception {
        when(courseService.saveCourse(any(Course.class))).thenReturn(testCourse);

        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCourse)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Test Course")));

        verify(courseService, times(1)).saveCourse(any(Course.class));
    }

    @Test
    void shouldUpdateCourse() throws Exception {
        when(courseService.getCourseById(1L)).thenReturn(Optional.of(testCourse));
        when(courseService.saveCourse(any(Course.class))).thenReturn(testCourse);

        mockMvc.perform(put("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCourse)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Test Course")));

        verify(courseService, times(1)).getCourseById(1L);
        verify(courseService, times(1)).saveCourse(any(Course.class));
    }

    @Test
    void shouldDeleteCourse() throws Exception {
        when(courseService.getCourseById(1L)).thenReturn(Optional.of(testCourse));
        doNothing().when(courseService).deleteCourse(1L);

        mockMvc.perform(delete("/api/courses/1"))
                .andExpect(status().isNoContent());

        verify(courseService, times(1)).getCourseById(1L);
        verify(courseService, times(1)).deleteCourse(1L);
    }

    @Test
    void shouldSearchCourses() throws Exception {
        when(courseService.searchCoursesByKeyword("space")).thenReturn(List.of(testCourse));

        mockMvc.perform(get("/api/courses/search?keyword=space"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Test Course")));

        verify(courseService, times(1)).searchCoursesByKeyword("space");
    }

    @Test
    void shouldFilterCourses() throws Exception {
        when(courseService.filterCourses("Space", "Elementary", "M", 7, 9))
                .thenReturn(List.of(testCourse));

        mockMvc.perform(get("/api/courses/filter")
                        .param("subject", "Space")
                        .param("gradeLevel", "Elementary")
                        .param("sizeCategory", "M")
                        .param("minAge", "7")
                        .param("maxAge", "9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Test Course")));

        verify(courseService, times(1)).filterCourses("Space", "Elementary", "M", 7, 9);
    }
}
