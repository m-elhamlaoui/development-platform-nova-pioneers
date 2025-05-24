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
@ComponentScan(basePackages = "com.nova_pioneers.teaching.Repositories")
@ActiveProfiles("test")

public class FilteringRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CourseRepository courseRepository;

    @Test
    void shouldFilterCoursesBySubjectAndGradeLevel() {
        // given
        Teacher teacher = new Teacher();
        teacher.setUsername("filter_teacher");
        teacher.setEmail("filter@example.com");
        teacher.setFirstName("Filter");
        teacher.setLastName("Test");
        teacher.setJoinDate(LocalDate.now());
        teacher.setAccumulatedXp(0);
        teacher.setTitle("Beginner Teacher");

        // Save the teacher to get an ID
        teacher = entityManager.persist(teacher);

        // Course 1 - Should match filter
        Course course1 = new Course();
        course1.setTitle("Space Course");
        course1.setDescription("Space Description");
        course1.setGradeLevel("Elementary");
        course1.setSubject("Astronomy");
        course1.setCreatedDate(LocalDate.now());
        course1.setXpValue(500);
        course1.setSizeCategory("M");
        course1.setRecommendedAge(7);
        course1.setTeacher(teacher);

        entityManager.persist(course1);

        // Course 2 - Should not match filter
        Course course2 = new Course();
        course2.setTitle("Math Course");
        course2.setDescription("Math Description");
        course2.setGradeLevel("Middle School");
        course2.setSubject("Mathematics");
        course2.setCreatedDate(LocalDate.now());
        course2.setXpValue(600);
        course2.setSizeCategory("L");
        course2.setRecommendedAge(12);
        course2.setTeacher(teacher);

        entityManager.persist(course2);

        entityManager.flush();

        // when
        // This needs to match a method in your CourseRepository interface
        List<Course> foundCourses = courseRepository.findBySubjectAndGradeLevelAndRecommendedAgeBetween(
                "Astronomy", "Elementary", 7, 9);

        // then
        assertThat(foundCourses).hasSize(1);
        assertThat(foundCourses.get(0).getTitle()).isEqualTo("Space Course");
    }
}