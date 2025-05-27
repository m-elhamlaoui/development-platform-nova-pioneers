package com.nova_pioneers.teaching;

import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Teacher;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@ComponentScan(basePackages = "com.nova_pioneers.teaching.Repositories")
public class CourseRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CourseRepository courseRepository;

    @Test
    public void whenFindByTeacherId_thenReturnCourses() {
        // given
        // Create a test teacher
        Teacher teacher = new Teacher();
        teacher.setUsername("test_teacher");
        teacher.setEmail("test@example.com");
        teacher.setFirstName("Test");
        teacher.setLastName("Teacher");
        teacher.setJoinDate(LocalDate.now());
        teacher.setAccumulatedXp(0);
        teacher.setTitle("Beginner Teacher");

        // Save the teacher to get an ID
        teacher = entityManager.persist(teacher);

        // Create a test course
        Course course = new Course();
        course.setTitle("Test Course");
        course.setDescription("Test Description");
        course.setGradeLevel("Elementary");
        course.setSubject("Space");
        course.setCreatedDate(LocalDate.now());
        course.setXpValue(500);
        course.setSizeCategory("M");
        course.setRecommendedAge(8);
        course.setTeacher(teacher); // Use setTeacher instead of setTeacherId

        course = entityManager.persist(course);
        entityManager.flush();

        // when
        List<Course> found = courseRepository.findByTeacher_Id(teacher.getId());

        // then
        assertThat(found.size()).isEqualTo(1);
        assertThat(found.get(0).getTitle()).isEqualTo(course.getTitle());
    }

    @Test
    public void whenFindByKeyword_thenReturnCourses() {
        // given
        // Create a teacher first (since teacher is required for Course)
        Teacher teacher = new Teacher();
        teacher.setUsername("space_teacher");
        teacher.setEmail("space@example.com");
        teacher.setFirstName("Space");
        teacher.setLastName("Teacher");
        teacher.setJoinDate(LocalDate.now());
        teacher.setAccumulatedXp(0);
        teacher.setTitle("Beginner Teacher");

        teacher = entityManager.persist(teacher);

        Course course = new Course();
        course.setTitle("Space Exploration");
        course.setDescription("Learn about space exploration");
        course.setGradeLevel("Elementary");
        course.setSubject("Astronomy");
        course.setCreatedDate(LocalDate.now()); // Use LocalDate instead of Date
        course.setXpValue(500);
        course.setSizeCategory("M");
        course.setRecommendedAge(8);
        course.setTeacher(teacher); // Use setTeacher instead of setTeacherId

        entityManager.persist(course);
        entityManager.flush();

        // when
        // Use the correct repository method name
        List<Course> found = courseRepository.searchByKeyword("space");

        // then
        assertThat(found.size()).isGreaterThan(0);
        assertThat(found.get(0).getTitle()).isEqualTo("Space Exploration");
    }
}