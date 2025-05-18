package com.nova_pioneers.teaching;

import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.Repositories.TeacherRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driverClassName=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class TeachingServiceApplicationTests {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private TeacherRepository teacherRepository;

    @Test
    void contextLoads() {
        // This test will pass if the test class loads with mocks created
    }
}
