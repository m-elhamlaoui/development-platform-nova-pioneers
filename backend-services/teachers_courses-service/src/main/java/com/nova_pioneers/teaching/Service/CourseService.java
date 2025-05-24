package com.nova_pioneers.teaching.Service;
import com.nova_pioneers.teaching.DTO.ContentSectionDTO;
import com.nova_pioneers.teaching.DTO.CourseDTO;
import com.nova_pioneers.teaching.DTO.LessonDTO;
import com.nova_pioneers.teaching.Repositories.ContentSectionRepository;
import com.nova_pioneers.teaching.Repositories.CourseRepository;
import com.nova_pioneers.teaching.Repositories.LessonRepository;
import com.nova_pioneers.teaching.Repositories.TeacherRepository;
import com.nova_pioneers.teaching.model.ContentSection;
import com.nova_pioneers.teaching.model.Course;
import com.nova_pioneers.teaching.model.Lesson;
import com.nova_pioneers.teaching.model.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private FileUploadService fileUploadService;


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

    /**saveCourseWithDetails
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

            // Get teacher from repository
            Teacher teacher = teacherRepository.findById(teacherId)
                    .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));
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
        // Use loadLessonsWithContentSections instead of just finding lessons
        List<Lesson> savedLessons = loadLessonsWithContentSections(course.getId());
        return mapperService.mapToDTO(course, savedLessons);
    }

    /**
     * Private helper method to save lessons and their content sections
     */
    @Transactional

    protected void saveLessonsForCourse(Course course, List<LessonDTO> lessonDTOs) {
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

            // Process content sections if they exist
            if (lessonDTO.getContent() != null && !lessonDTO.getContent().isEmpty()) {
                // Create content sections from DTOs
                Lesson finalLesson = lesson;
                List<ContentSection> contentSections = lessonDTO.getContent().stream()
                        .map(sectionDTO -> {
                            ContentSection section = mapperService.mapToEntity(sectionDTO, finalLesson);
                            return section;
                        })
                        .collect(Collectors.toList());

                // Use the helper method to properly update the bidirectional relationship
                lesson.updateContentSections(contentSections);
            } else {
                // Clear content sections if none are provided
                lesson.updateContentSections(new ArrayList<>());
            }

            // Save the lesson
            lesson = lessonRepository.save(lesson);
            processedLessonIds.add(lesson.getId());
        }

        // Delete any lessons that weren't in the update (if this is an update operation)
        if (!processedLessonIds.isEmpty() && course.getId() != null) {
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

    /**
     * Get all courses in DTO format
     */
    public List<CourseDTO> getAllCoursesDTO() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(course -> {
                    List<Lesson> lessons = loadLessonsWithContentSections(course.getId());
                    return mapperService.mapToDTO(course, lessons);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get course by ID in DTO format
     */
    public Optional<CourseDTO> getCourseByIdDTO(Long id) {
        Optional<Course> courseOpt = courseRepository.findById(id);

        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();
            List<Lesson> lessons = loadLessonsWithContentSections(course.getId());
            return Optional.of(mapperService.mapToDTO(course, lessons));
        }

        return Optional.empty();
    }

    /**
     * Get courses by teacher ID in DTO format
     */
    public List<CourseDTO> getCoursesByTeacherDTO(Long teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        return courses.stream()
                .map(course -> {
                    List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceOrderAsc(course.getId());
                    return mapperService.mapToDTO(course, lessons);
                })
                .collect(Collectors.toList());
    }

    /**
     * Save course with full details (DTO format)
     */
    @Transactional
    public CourseDTO saveCourseWithDetails(CourseDTO courseDTO) {
        // For new courses, we need a teacher
        // In a real implementation, you'd get this from security context or request
        // For simplicity, using teacher ID 1 for new courses
        Long teacherId = 1L;
        return saveOrUpdateCourseWithDetails(courseDTO, teacherId);
    }
    @Transactional(readOnly = true)
    public List<Lesson> loadLessonsWithContentSections(Long courseId) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceOrderAsc(courseId);

        if (lessons != null) {
            for (Lesson lesson : lessons) {
                // Force initialization of the content sections collection
                System.out.println("Loading content sections for lesson: " + lesson.getTitle());
                List<ContentSection> sections = contentSectionRepository.findByLessonIdOrderBySequenceOrderAsc(lesson.getId());
                System.out.println("Found " + (sections != null ? sections.size() : 0) + " content sections");

                // Properly initialize the content sections to avoid orphan collection issues
                if (lesson.getContentSections() == null) {
                    lesson.setContentSections(new ArrayList<>());
                }

                // Only update if they're not already loaded
                if (lesson.getContentSections().isEmpty() && !sections.isEmpty()) {
                    for (ContentSection section : sections) {
                        // Use the helper method to maintain the bidirectional relationship
                        lesson.addContentSection(section);
                    }
                }
            }
        }

        return lessons;

}
    @Transactional
    public CourseDTO createCourseFromFrontend(Map<String, Object> frontendData,
                                              MultipartFile thumbnailFile,
                                              List<MultipartFile> imageFiles) {
        try {
            // Transform frontend data to backend Course entity
            Course course = transformFrontendDataToCourse(frontendData);

            // Handle thumbnail upload
            if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
                String thumbnailPath = fileUploadService.saveCourseImage(thumbnailFile, "thumbnail");
                course.setThumbnailPath(thumbnailPath);
            }

            // Save course first to get ID
            course = courseRepository.save(course);

            // Handle lessons with images
            List<Map<String, Object>> frontendLessons = (List<Map<String, Object>>) frontendData.get("lessons");
            if (frontendLessons != null) {
                saveLessonsFromFrontend(course, frontendLessons, imageFiles);
            }

            // Reload course with all lessons and content
            List<Lesson> savedLessons = loadLessonsWithContentSections(course.getId());
            return mapperService.mapToDTO(course, savedLessons);

        } catch (Exception e) {
            // Cleanup uploaded files if course creation fails
            // ... cleanup logic
            throw new RuntimeException("Failed to create course: " + e.getMessage(), e);
        }
    }

    private Course transformFrontendDataToCourse(Map<String, Object> frontendData) {
        Course course = new Course();

        // Basic fields - direct mapping
        course.setTitle((String) frontendData.get("title"));
        course.setDescription((String) frontendData.get("description"));
        course.setSubject((String) frontendData.get("subject"));
        course.setCreatedDate(LocalDate.now());

        // Transform grade_level to gradeLevel
        course.setGradeLevel((String) frontendData.get("grade_level"));

        // Transform size_category: "Medium" -> "M"
        String frontendSize = (String) frontendData.get("size_category");
        course.setSizeCategory(mapSizeCategory(frontendSize));

        // Transform xp_value
        Object xpValue = frontendData.get("xp_value");
        if (xpValue instanceof Number) {
            course.setXpValue(((Number) xpValue).intValue());
        }

        // Transform recommended_age: "11-14" -> 11 (take first number)
        String recommendedAgeStr = (String) frontendData.get("recommended_age");
        course.setRecommendedAge(parseRecommendedAge(recommendedAgeStr));

        // Set teacher (you might want to get this from authentication context)
        Teacher teacher = teacherRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Default teacher not found"));
        course.setTeacher(teacher);

        return course;
    }

    private String mapSizeCategory(String frontendSize) {
        if (frontendSize == null) return "M";

        switch (frontendSize.toLowerCase()) {
            case "small":
                return "S";
            case "medium":
                return "M";
            case "large":
                return "L";
            default:
                return "M";
        }
    }

    private Integer parseRecommendedAge(String ageRange) {
        if (ageRange == null || ageRange.trim().isEmpty()) {
            return 8; // default
        }

        try {
            // Handle formats like "11-14", "8-10", "12"
            String[] parts = ageRange.split("-");
            return Integer.parseInt(parts[0].trim());
        } catch (NumberFormatException e) {
            return 8; // default fallback
        }
    }

    @Transactional
    protected void saveLessonsFromFrontend(Course course, List<Map<String, Object>> frontendLessons,
                                           List<MultipartFile> imageFiles) {
        int imageIndex = 0;

        for (int lessonIndex = 0; lessonIndex < frontendLessons.size(); lessonIndex++) {
            Map<String, Object> frontendLesson = frontendLessons.get(lessonIndex);

            // Create lesson entity
            Lesson lesson = new Lesson();
            lesson.setTitle((String) frontendLesson.get("title"));
            lesson.setContent((String) frontendLesson.get("content"));
            lesson.setSequenceOrder(((Number) frontendLesson.get("sequence_order")).intValue());
            lesson.setCourse(course);

            // Handle lesson image if available
            if (imageFiles != null && imageIndex < imageFiles.size()) {
                MultipartFile lessonImage = imageFiles.get(imageIndex);
                if (lessonImage != null && !lessonImage.isEmpty()) {
                    try {
                        String imagePath = fileUploadService.saveLessonImage(lessonImage, "lesson");
                        lesson.setImagePath(imagePath);
                        imageIndex++;
                    } catch (Exception e) {
                        System.err.println("Failed to save lesson image: " + e.getMessage());
                    }
                }
            }

            // Save lesson to get ID
            lesson = lessonRepository.save(lesson);

            // Handle lesson_contents
            List<Map<String, Object>> frontendContents = (List<Map<String, Object>>) frontendLesson.get("lesson_contents");
            if (frontendContents != null) {
                imageIndex = saveContentSectionsFromFrontend(lesson, frontendContents, imageFiles, imageIndex);
            }
        }
    }

    private int saveContentSectionsFromFrontend(Lesson lesson, List<Map<String, Object>> frontendContents,
                                                List<MultipartFile> imageFiles, int currentImageIndex) {
        int imageIndex = currentImageIndex;

        for (Map<String, Object> frontendContent : frontendContents) {
            ContentSection contentSection = new ContentSection();
            contentSection.setSubheading((String) frontendContent.get("subheading"));
            contentSection.setText((String) frontendContent.get("text"));
            contentSection.setFunFact((String) frontendContent.get("fun_fact"));
            contentSection.setSequenceOrder(((Number) frontendContent.get("sequence_order")).intValue());
            contentSection.setLesson(lesson);

            // Handle content image if available
            if (imageFiles != null && imageIndex < imageFiles.size()) {
                MultipartFile contentImage = imageFiles.get(imageIndex);
                if (contentImage != null && !contentImage.isEmpty()) {
                    try {
                        String imagePath = fileUploadService.saveContentImage(contentImage, "content");
                        contentSection.setImagePath(imagePath);
                        imageIndex++;
                    } catch (Exception e) {
                        System.err.println("Failed to save content image: " + e.getMessage());
                    }
                }
            }

            contentSectionRepository.save(contentSection);
        }

        return imageIndex;
    }
    }
