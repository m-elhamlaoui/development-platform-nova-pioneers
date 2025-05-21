package com.nova_pioneers.teaching;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.nova_pioneers.teaching.DTO.ContentSectionDTO;
import com.nova_pioneers.teaching.DTO.CourseDTO;
import com.nova_pioneers.teaching.DTO.LessonDTO;
import com.nova_pioneers.teaching.Service.CourseService;
import com.nova_pioneers.teaching.controllers.CourseController;




@ExtendWith(MockitoExtension.class)
public class CourseDetailedControllerTest {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private CourseService courseService;

    @InjectMocks
    private CourseController courseController;

    private CourseDTO testCourseDTO;

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        mockMvc = MockMvcBuilders.standaloneSetup(courseController).build();

        // Create a sample detailed course DTO
        testCourseDTO = new CourseDTO();
        testCourseDTO.setId(1L);
        testCourseDTO.setTitle("Space Adventure");
        testCourseDTO.setDescription("Journey to the stars");
        testCourseDTO.setThumbnail("/api/placeholder/800/600");
        testCourseDTO.setSize("M");
        testCourseDTO.setInstructor("Professor Stella");
        testCourseDTO.setRating(4.8);
        testCourseDTO.setReviews(25);

        // Create sample lessons
        List<LessonDTO> lessons = new ArrayList<>();
        LessonDTO lesson = new LessonDTO();
        lesson.setId(1L);
        lesson.setTitle("Introduction to Space");
        lesson.setImage("/api/placeholder/800/450");
        lesson.setSequenceOrder(1);

        // Create sample content sections
        List<ContentSectionDTO> contentSections = new ArrayList<>();
        ContentSectionDTO section1 = new ContentSectionDTO();
        section1.setId(1L);
        section1.setSubheading("Welcome to Space!");
        section1.setText("Explore the wonders of our universe");
        section1.setImage("/api/placeholder/600/400");
        section1.setSequenceOrder(1);
        contentSections.add(section1);

        ContentSectionDTO section2 = new ContentSectionDTO();
        section2.setId(2L);
        section2.setFunFact("Did you know that one day on Venus is longer than one year on Venus?");
        section2.setSequenceOrder(2);
        contentSections.add(section2);

        lesson.setContent(contentSections);
        lessons.add(lesson);
        testCourseDTO.setLessons(lessons);
    }

    @Test
    void shouldGetAllCoursesDetailed() throws Exception {
        when(courseService.getAllCoursesDTO()).thenReturn(List.of(testCourseDTO));

        mockMvc.perform(get("/api/courses/detailed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Space Adventure")))
                .andExpect(jsonPath("$[0].instructor", is("Professor Stella")))
                .andExpect(jsonPath("$[0].lessons", hasSize(1)))
                .andExpect(jsonPath("$[0].lessons[0].title", is("Introduction to Space")))
                .andExpect(jsonPath("$[0].lessons[0].content", hasSize(2)));

        verify(courseService, times(1)).getAllCoursesDTO();
    }

    @Test
    void shouldGetCourseByIdDetailed() throws Exception {
        when(courseService.getCourseByIdDTO(1L)).thenReturn(Optional.of(testCourseDTO));

        mockMvc.perform(get("/api/courses/1/detailed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Space Adventure")))
                .andExpect(jsonPath("$.thumbnail", is("/api/placeholder/800/600")))
                .andExpect(jsonPath("$.lessons[0].content[0].subheading", is("Welcome to Space!")))
                .andExpect(jsonPath("$.lessons[0].content[1].funFact", containsString("Venus")));

        verify(courseService, times(1)).getCourseByIdDTO(1L);
    }

    @Test
    void shouldCreateCourseDetailed() throws Exception {
        when(courseService.saveCourseWithDetails(any(CourseDTO.class))).thenReturn(testCourseDTO);

        mockMvc.perform(post("/api/courses/detailed")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCourseDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Space Adventure")))
                .andExpect(jsonPath("$.lessons", hasSize(1)));

        verify(courseService, times(1)).saveCourseWithDetails(any(CourseDTO.class));
    }

    @Test
    void shouldUpdateCourseDetailed() throws Exception {
        when(courseService.getCourseById(1L)).thenReturn(Optional.of(new com.nova_pioneers.teaching.model.Course()));
        when(courseService.saveCourseWithDetails(any(CourseDTO.class))).thenReturn(testCourseDTO);

        mockMvc.perform(put("/api/courses/1/detailed")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCourseDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Space Adventure")))
                .andExpect(jsonPath("$.lessons[0].title", is("Introduction to Space")));

        verify(courseService, times(1)).getCourseById(1L);
        verify(courseService, times(1)).saveCourseWithDetails(any(CourseDTO.class));
    }
}
