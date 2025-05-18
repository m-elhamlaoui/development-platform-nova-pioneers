package com.nova_pioneers.teaching.Service;
import com.nova_pioneers.teaching.DTO.ContentSectionDTO;
import com.nova_pioneers.teaching.DTO.CourseDTO;
import com.nova_pioneers.teaching.DTO.LessonDTO;
import com.nova_pioneers.teaching.Repositories.ContentSectionRepository;
import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.Repositories.LessonRepository;

import com.nova_pioneers.teaching.Service.CourseMapperService;
import com.nova_pioneers.teaching.model.ContentSection;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Lesson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ContentSectionRepository contentSectionRepository;

    @Autowired
    private CourseMapperService mapperService;

    // Original methods kept intact
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public List<Course> getCoursesByTeacher(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId);
    }

    public Course saveCourse(Course course) {
        // Calculate XP based on course size and age group
        calculateXpForCourse(course);
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    // Implement XP rules as per requirements
    private void calculateXpForCourse(Course course) {
        // Example XP calculation based on size and age
        int baseXp = 0;

        // Size-based XP
        switch(course.getSizeCategory().toUpperCase()) {
            case "S":
                baseXp = 200;
                break;
            case "M":
                baseXp = 500;
                break;
            case "L":
                baseXp = 1000;
                break;
            default:
                baseXp = 100;
        }

        // Age multiplier (older kids' courses are worth more XP)
        int ageMultiplier = Math.max(1, course.getRecommendedAge() / 5);

        course.setXpValue(baseXp * ageMultiplier);
    }

    public List<Course> searchCoursesByKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return courseRepository.findAll();
        }
        return courseRepository.searchByKeyword(keyword);
    }

    public List<Course> filterCourses(String subject, String gradeLevel,
                                      String sizeCategory, Integer minAge, Integer maxAge) {
        return courseRepository.filterCourses(subject, gradeLevel, sizeCategory, minAge, maxAge);
    }

    // New methods for enhanced course functionality

    /**
     * Get course with detailed structure (lessons and content sections)
     */
    public Optional<CourseDTO> getCourseWithDetailsById(Long id) {
        Optional<Course> courseOpt = courseRepository.findById(id);

        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();
            List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceOrderAsc(course.getId());
            return Optional.of(mapperService.mapToDTO(course, lessons));
        }

        return Optional.empty();
    }

    /**
     * Get all courses with basic details (without lessons)
     */
    public List<CourseDTO> getAllCoursesWithBasicDetails() {
        return courseRepository.findAll().stream()
                .map(course -> mapperService.mapToDTO(course, null))
                .collect(Collectors.toList());
    }

    /**
     * Save or update a course with its complete structure
     */
    @Transactional
    public CourseDTO saveOrUpdateCourseWithDetails(CourseDTO courseDTO, Long teacherId) {
        // Get or create the course
        Course course;
        boolean isNewCourse = (courseDTO.getId() == null);

        if (isNewCourse) {
            course = new Course();
        } else {
            course = courseRepository.findById(courseDTO.getId())
                    .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseDTO.getId()));
        }

        // Update course basic fields
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());
        course.setThumbnail(courseDTO.getThumbnail());
        course.setSizeCategory(courseDTO.getSize());

        // If it's a new course, set additional fields
        if (isNewCourse) {
            // These would come from the request in a real implementation
            course.setGradeLevel("Elementary");
            course.setSubject("Space");
            course.setRecommendedAge(8);

            // Set teacher - this would be obtained from the repository in a real implementation
            // For now we'll just set the id
            Teacher teacher = new Teacher();
            teacher.setId(teacherId);
            course.setTeacher(teacher);
        }

        // Calculate XP based on course settings
        calculateXpForCourse(course);

        // Save the course to get an ID if it's new
        course = courseRepository.save(course);

        // Process lessons if they exist
        if (courseDTO.getLessons() != null && !courseDTO.getLessons().isEmpty()) {
            saveLessonsForCourse(course, courseDTO.getLessons());
        }

        // Reload the course with all its lessons to return
        List<Lesson> savedLessons = lessonRepository.findByCourseIdOrderBySequenceOrderAsc(course.getId());
        return mapperService.mapToDTO(course, savedLessons);
    }

    /**
     * Private helper method to save lessons and their content sections
     */
    private void saveLessonsForCourse(Course course, List<LessonDTO> lessonDTOs) {
        // Keep track of which lessons to keep
        List<Long> processedLessonIds = new ArrayList<>();

        // Process each lesson
        for (int i = 0; i < lessonDTOs.size(); i++) {
            LessonDTO lessonDTO = lessonDTOs.get(i);

            // Create or update the lesson
            Lesson lesson;
            boolean isNewLesson = (lessonDTO.getId() == null);

            if (isNewLesson) {
                lesson = mapperService.mapToEntity(lessonDTO, course);
            } else {
                lesson = lessonRepository.findById(lessonDTO.getId())
                        .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonDTO.getId()));

                // Update existing lesson
                lesson.setTitle(lessonDTO.getTitle());
                lesson.setImage(lessonDTO.getImage());
                lesson.setCourse(course);
            }

            // Ensure proper ordering
            lesson.setSequenceOrder(i + 1);

            // Save the lesson
            lesson = lessonRepository.save(lesson);
            processedLessonIds.add(lesson.getId());

            // Process content sections if they exist
            if (lessonDTO.getContent() != null && !lessonDTO.getContent().isEmpty()) {
                saveContentSectionsForLesson(lesson, lessonDTO.getContent());
            }
        }

        // Delete any lessons that weren't in the update (if this is an update operation)
        if (!processedLessonIds.isEmpty()) {
            List<Lesson> existingLessons = lessonRepository.findByCourseIdOrderBySequenceOrderAsc(course.getId());

            for (Lesson existingLesson : existingLessons) {
                if (!processedLessonIds.contains(existingLesson.getId())) {
                    lessonRepository.delete(existingLesson);
                }
            }
        }
    }

    /**
     * Private helper method to save content sections for a lesson
     */
    private void saveContentSectionsForLesson(Lesson lesson, List<ContentSectionDTO> sectionDTOs) {
        // Keep track of which sections to keep
        List<Long> processedSectionIds = new ArrayList<>();

        // Process each content section
        for (int i = 0; i < sectionDTOs.size(); i++) {
            ContentSectionDTO sectionDTO = sectionDTOs.get(i);

            // Create or update the content section
            ContentSection section;
            boolean isNewSection = (sectionDTO.getId() == null);

            if (isNewSection) {
                section = mapperService.mapToEntity(sectionDTO, lesson);
            } else {
                section = contentSectionRepository.findById(sectionDTO.getId())
                        .orElseThrow(() -> new RuntimeException("Content section not found with id: " + sectionDTO.getId()));

                // Update existing section
                section.setSubheading(sectionDTO.getSubheading());
                section.setText(sectionDTO.getText());
                section.setImage(sectionDTO.getImage());
                section.setFunFact(sectionDTO.getFunFact());
                section.setLesson(lesson);
            }

            // Ensure proper ordering
            section.setSequenceOrder(i + 1);

            // Save the section
            section = contentSectionRepository.save(section);
            processedSectionIds.add(section.getId());
        }

        // Delete any sections that weren't in the update (if this is an update operation)
        if (!processedSectionIds.isEmpty()) {
            List<ContentSection> existingSections = contentSectionRepository.findByLessonIdOrderBySequenceOrderAsc(lesson.getId());

            for (ContentSection existingSection : existingSections) {
                if (!processedSectionIds.contains(existingSection.getId())) {
                    contentSectionRepository.delete(existingSection);
                }
            }
        }
    }

    // For imports to work correctly
    private static class Teacher {
        private Long id;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
    }
}