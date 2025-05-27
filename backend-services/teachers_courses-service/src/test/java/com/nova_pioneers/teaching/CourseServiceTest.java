package com.nova_pioneers.teaching;

import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.Service.CourseService;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Teacher;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    private Course testCourse;
    private Teacher testTeacher;

    @BeforeEach
    void setUp() {
        // Create a teacher first
        testTeacher = new Teacher();
        testTeacher.setId(1L);
        testTeacher.setUsername("test_teacher");
        testTeacher.setEmail("test@example.com");
        testTeacher.setFirstName("Test");
        testTeacher.setLastName("Teacher");

        // Then create the course and set the teacher
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
        testCourse.setTeacher(testTeacher); // Use setTeacher instead of setTeacherId
    }

    @Test
    void shouldGetAllCourses() {
        // given
        when(courseRepository.findAll()).thenReturn(Arrays.asList(testCourse));

        // when
        List<Course> courses = courseService.getAllCourses();

        // then
        assertThat(courses).hasSize(1);
        assertThat(courses.get(0).getTitle()).isEqualTo("Test Course");
        verify(courseRepository, times(1)).findAll();
    }

    @Test
    void shouldGetCourseById() {
        // given
        when(courseRepository.findById(1L)).thenReturn(Optional.of(testCourse));

        // when
        Optional<Course> found = courseService.getCourseById(1L);

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getTitle()).isEqualTo("Test Course");
        verify(courseRepository, times(1)).findById(1L);
    }

    @Test
    void shouldSaveCourse() {
        // given
        when(courseRepository.save(any(Course.class))).thenReturn(testCourse);

        // when
        Course saved = courseService.saveCourse(testCourse);

        // then
        assertThat(saved.getTitle()).isEqualTo("Test Course");
        verify(courseRepository, times(1)).save(testCourse);
    }

    @Test
    void shouldDeleteCourse() {
        // given
        doNothing().when(courseRepository).deleteById(1L);

        // when
        courseService.deleteCourse(1L);

        // then
        verify(courseRepository, times(1)).deleteById(1L);
    }

    @Test
    void shouldGetCoursesByTeacher() {
        // given
        when(courseRepository.findByTeacher_Id(1L)).thenReturn(Arrays.asList(testCourse));

        // when
        List<Course> courses = courseService.getCoursesByTeacher(1L);

        // then
        assertThat(courses).hasSize(1);
        assertThat(courses.get(0).getTeacher().getId()).isEqualTo(1L);
        verify(courseRepository, times(1)).findByTeacher_Id(1L);
    }

    @Test
    void shouldSearchCoursesByKeyword() {
        // given
        when(courseRepository.searchByKeyword("test")).thenReturn(Arrays.asList(testCourse));

        // when
        List<Course> courses = courseService.searchCoursesByKeyword("test");

        // then
        assertThat(courses).hasSize(1);
        assertThat(courses.get(0).getTitle()).isEqualTo("Test Course");
        verify(courseRepository, times(1)).searchByKeyword("test");
    }
}