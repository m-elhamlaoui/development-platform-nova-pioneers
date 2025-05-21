package com.nova_pioneers.teaching;

import com.nova_pioneers.teaching.Repositories.ContentSectionRepository;
import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.Repositories.LessonRepository;
import com.nova_pioneers.teaching.Repositories.TeacherRepository;
import com.nova_pioneers.teaching.model.ContentSection;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Lesson;
import com.nova_pioneers.teaching.model.Teacher;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class ContentSectionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ContentSectionRepository contentSectionRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Test
    public void whenFindByLessonId_thenReturnContentSections() {
        // given
        // Create a teacher
        Teacher teacher = new Teacher();
        teacher.setUsername("teacher_test");
        teacher.setEmail("teacher@example.com");
        teacher.setFirstName("Test");
        teacher.setLastName("Teacher");
        teacher.setJoinDate(LocalDate.now());
        teacher = entityManager.persist(teacher);

        // Create a course
        Course course = new Course();
        course.setTitle("Test Course");
        course.setDescription("Test Description");
        course.setGradeLevel("Elementary");
        course.setSubject("Space");
        course.setSizeCategory("M");
        course.setRecommendedAge(8);
        course.setTeacher(teacher);
        course = entityManager.persist(course);

        // Create a lesson
        Lesson lesson = new Lesson();
        lesson.setTitle("Test Lesson");
        lesson.setImage("/api/placeholder/800/450");
        lesson.setSequenceOrder(1);
        lesson.setCourse(course);
        lesson = entityManager.persist(lesson);

        // Create content sections
        ContentSection section1 = new ContentSection();
        section1.setSubheading("Test Subheading 1");
        section1.setText("Test Text 1");
        section1.setImage("/api/placeholder/600/400");
        section1.setSequenceOrder(1);
        section1.setLesson(lesson);
        entityManager.persist(section1);

        ContentSection section2 = new ContentSection();
        section2.setSubheading("Test Subheading 2");
        section2.setText("Test Text 2");
        section2.setSequenceOrder(2);
        section2.setLesson(lesson);
        entityManager.persist(section2);

        entityManager.flush();

        // when
        List<ContentSection> found = contentSectionRepository.findByLessonIdOrderBySequenceOrderAsc(lesson.getId());

        // then
        assertThat(found).hasSize(2);
        assertThat(found.get(0).getSubheading()).isEqualTo("Test Subheading 1");
        assertThat(found.get(0).getSequenceOrder()).isEqualTo(1);
        assertThat(found.get(1).getSubheading()).isEqualTo("Test Subheading 2");
        assertThat(found.get(1).getSequenceOrder()).isEqualTo(2);
    }
}
