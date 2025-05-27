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
        return courseRepository.findByTeacher_Id(teacherId);
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
        switch (course.getSizeCategory().toUpperCase()) {
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
     * saveCourseWithDetails
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

        // Delete any lessons that weren't in the update (if this is an update
        // operation)
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
                        .orElseThrow(
                                () -> new RuntimeException("Content section not found with id: " + sectionDTO.getId()));

                // Update existing section
                section.setSubheading(sectionDTO.getSubheading());
                section.setText(sectionDTO.getText());
                section.setImagePath(sectionDTO.getImage());
                section.setFunFact(sectionDTO.getFunFact());
                section.setLesson(lesson);
            }

            // Ensure proper ordering
            section.setSequenceOrder(i + 1);

            // Save the section
            section = contentSectionRepository.save(section);
            processedSectionIds.add(section.getId());
        }

        // Delete any sections that weren't in the update (if this is an update
        // operation)
        if (!processedSectionIds.isEmpty()) {
            List<ContentSection> existingSections = contentSectionRepository
                    .findByLessonIdOrderBySequenceOrderAsc(lesson.getId());

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
        List<Course> courses = courseRepository.findByTeacher_Id(teacherId);

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
                List<ContentSection> sections = contentSectionRepository
                        .findByLessonIdOrderBySequenceOrderAsc(lesson.getId());
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
    public CourseDTO createCourseFromFrontend(Map<String, Object> courseData,
            MultipartFile thumbnail, List<MultipartFile> images) {
        try {
            System.out.println("=== COURSE SERVICE DEBUG ===");
            System.out.println("Received courseData: " + courseData);

            // Check teacher_id extraction
            Object teacherIdObj = courseData.get("teacher_id");
            System.out.println("Raw teacher_id from frontend: " + teacherIdObj);
            System.out.println("Teacher_id type: " + (teacherIdObj != null ? teacherIdObj.getClass() : "null"));

            if (teacherIdObj == null) {
                throw new RuntimeException("Teacher ID is missing from course data");
            }

            Long teacherId = ((Number) teacherIdObj).longValue();
            System.out.println("Parsed teacher_id: " + teacherId);

            // CRITICAL: Check if this teacher actually exists
            Optional<Teacher> teacherOpt = teacherRepository.findById(teacherId);
            if (!teacherOpt.isPresent()) {
                System.err.println("Teacher with ID " + teacherId + " does not exist!");

                // List all teachers for debugging
                List<Teacher> allTeachers = teacherRepository.findAll();
                System.out.println("Available teachers:");
                for (Teacher t : allTeachers) {
                    System.out.println("  - Teacher ID: " + t.getId() + ", User ID: " + t.getUserId() + ", Name: "
                            + t.getFirstName() + " " + t.getLastName());
                }

                throw new RuntimeException("Teacher with ID " + teacherId + " not found. Available teachers: " +
                        allTeachers.stream().map(Teacher::getId).collect(Collectors.toList()));
            }

            Teacher teacher = teacherOpt.get();
            System.out.println("Found teacher: " + teacher.getFirstName() + " " + teacher.getLastName() + " (ID: "
                    + teacher.getId() + ")");

            // CREATE THE COURSE USING YOUR EXISTING METHOD
            Course course = transformFrontendDataToCourse(courseData);
            System.out.println("Course entity created: " + course.getTitle());

            // Handle thumbnail upload
            if (thumbnail != null && !thumbnail.isEmpty()) {
                try {
                    // CHANGE THIS LINE:
                    // String thumbnailPath = fileUploadService.saveCourseThumbnail(thumbnail,
                    // course.getTitle());

                    // TO THIS:
                    String thumbnailPath = fileUploadService.saveCourseImage(thumbnail, course.getTitle());

                    course.setThumbnailPath(thumbnailPath);
                    System.out.println("Thumbnail saved: " + thumbnailPath);
                } catch (Exception e) {
                    System.err.println("Failed to save thumbnail: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            // Calculate XP and save course
            calculateXpForCourse(course);
            course = courseRepository.save(course);
            System.out.println("Course saved with ID: " + course.getId());

            // Handle lessons if provided
            List<Map<String, Object>> lessonsData = (List<Map<String, Object>>) courseData.get("lessons");
            if (lessonsData != null && !lessonsData.isEmpty()) {
                System.out.println("Processing " + lessonsData.size() + " lessons...");
                saveLessonsFromFrontend(course, lessonsData, images);
            }

            // Load the complete course with lessons and return DTO
            List<Lesson> savedLessons = loadLessonsWithContentSections(course.getId());
            CourseDTO result = mapperService.mapToDTO(course, savedLessons);

            System.out.println("Course creation completed successfully!");
            return result;

        } catch (Exception e) {
            System.err.println("Error in createCourseFromFrontend: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create course: " + e.getMessage(), e);
        }
    }

    @Transactional
    protected void saveLessonsFromFrontend(Course course, List<Map<String, Object>> frontendLessons,
            List<MultipartFile> imageFiles) {
        System.out.println("=== saveLessonsFromFrontend called ===");
        System.out.println("Course ID: " + course.getId());
        System.out.println("Number of lessons: " + frontendLessons.size());
        System.out.println("Number of image files: " + (imageFiles != null ? imageFiles.size() : 0));

        int imageIndex = 0;

        for (int lessonIndex = 0; lessonIndex < frontendLessons.size(); lessonIndex++) {
            Map<String, Object> frontendLesson = frontendLessons.get(lessonIndex);
            System.out.println("Processing lesson " + lessonIndex + ": " + frontendLesson.get("title"));

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
                    System.out.println(
                            "Processing lesson image " + imageIndex + ": " + lessonImage.getOriginalFilename());
                    try {
                        String imagePath = fileUploadService.saveLessonImage(lessonImage, "lesson");
                        lesson.setImage("/api/files/" + imagePath);
                        System.out.println("Lesson image saved: " + imagePath);
                        imageIndex++;
                    } catch (Exception e) {
                        System.err.println("Failed to save lesson image: " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            }

            // Handle resource links
            List<String> resourceLinks = (List<String>) frontendLesson.get("resource_links");
            if (resourceLinks != null && !resourceLinks.isEmpty()) {
                lesson.setResourceLinks(String.join(",", resourceLinks));
                System.out.println("Resource links saved: " + resourceLinks);
            }

            // Save lesson to get ID
            lesson = lessonRepository.save(lesson);
            System.out.println("Lesson saved with ID: " + lesson.getId());

            // Handle lesson_contents
            List<Map<String, Object>> frontendContents = (List<Map<String, Object>>) frontendLesson
                    .get("lesson_contents");
            if (frontendContents != null) {
                System.out.println(
                        "Processing " + frontendContents.size() + " content sections for lesson " + lesson.getId());
                imageIndex = saveContentSectionsFromFrontend(lesson, frontendContents, imageFiles, imageIndex);
            }
        }

        System.out.println("All lessons processed. Final image index: " + imageIndex);
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

            // Handle content image if available - FIX: Use correct method name
            if (imageFiles != null && imageIndex < imageFiles.size()) {
                MultipartFile contentImage = imageFiles.get(imageIndex);
                if (contentImage != null && !contentImage.isEmpty()) {
                    try {
                        String imagePath = fileUploadService.saveContentImage(contentImage, "content");
                        contentSection.setImage("/api/files/" + imagePath); // Changed from setImagePath
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

    // Add this method to your CourseService class

    private Course transformFrontendDataToCourse(Map<String, Object> frontendData) {
        Course course = new Course();

        System.out.println("=== transformFrontendDataToCourse ===");
        System.out.println("Frontend data: " + frontendData);

        try {
            course.setTitle((String) frontendData.get("title"));
            course.setDescription((String) frontendData.get("description"));
            course.setGradeLevel((String) frontendData.get("grade_level"));
            course.setSubject((String) frontendData.get("subject"));
            course.setSizeCategory(mapSizeCategory((String) frontendData.get("size_category")));
            course.setXpValue(((Number) frontendData.get("xp_value")).intValue());

            // Parse recommended age
            String ageStr = (String) frontendData.get("recommended_age");
            if (ageStr != null && !ageStr.trim().isEmpty()) {
                course.setRecommendedAge(parseRecommendedAge(ageStr));
            }

            course.setCreatedDate(LocalDate.now());
            course.setIsActive(true);

            // CRITICAL FIX: Get the Teacher entity, not just the ID
            Object teacherIdObj = frontendData.get("teacher_id");
            if (teacherIdObj != null) {
                Long teacherId = ((Number) teacherIdObj).longValue();
                System.out.println("Looking up teacher with ID: " + teacherId);

                // Find the Teacher entity by ID
                Optional<Teacher> teacherOpt = teacherRepository.findById(teacherId);
                if (teacherOpt.isPresent()) {
                    Teacher teacher = teacherOpt.get();
                    System.out.println("Found teacher: " + teacher.getFirstName() + " " + teacher.getLastName());
                    course.setTeacher(teacher); // Set the Teacher OBJECT, not the ID
                } else {
                    System.err.println("Teacher not found with ID: " + teacherId);
                    throw new RuntimeException("Teacher not found with ID: " + teacherId);
                }
            } else {
                System.err.println("No teacher_id provided in frontend data");
                throw new RuntimeException("Teacher ID is required");
            }

            System.out.println("Course entity created successfully");
            return course;

        } catch (Exception e) {
            System.err.println("Error transforming frontend data: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to transform course data: " + e.getMessage(), e);
        }
    }

    // Helper method to map size category
    private String mapSizeCategory(String frontendSize) {
        if (frontendSize == null) {
            return "M"; // Default to Medium
        }

        switch (frontendSize.toLowerCase()) {
            case "small":
                return "S";
            case "medium":
                return "M";
            case "large":
                return "L";
            default:
                // If it's already in the correct format (S, M, L), return as is
                if (frontendSize.matches("[SML]")) {
                    return frontendSize.toUpperCase();
                }
                return "M"; // Default to Medium
        }
    }

    // Helper method to parse recommended age
    private int parseRecommendedAge(String ageStr) {
        if (ageStr == null || ageStr.trim().isEmpty()) {
            return 8; // Default age
        }

        try {
            // Handle cases like "11-14" by taking the first number
            if (ageStr.contains("-")) {
                ageStr = ageStr.split("-")[0].trim();
            }
            return Integer.parseInt(ageStr);
        } catch (NumberFormatException e) {
            System.err.println("Failed to parse recommended age: " + ageStr);
            return 8; // Default age
        }
    }

    // Helper method to get or create default teacher
    private Teacher getOrCreateDefaultTeacher() {
        // First try to find an existing teacher
        Optional<Teacher> existingTeacher = teacherRepository.findById(1L);
        if (existingTeacher.isPresent()) {
            return existingTeacher.get();
        }

        // If no teacher exists, create a default one
        Teacher defaultTeacher = new Teacher();
        defaultTeacher.setUsername("default_teacher");
        defaultTeacher.setEmail("default@example.com");
        defaultTeacher.setFirstName("Default");
        defaultTeacher.setLastName("Teacher");
        defaultTeacher.setJoinDate(LocalDate.now());
        defaultTeacher.setAccumulatedXp(0);
        defaultTeacher.setTitle("Beginner Teacher");

        System.out.println("Creating default teacher...");
        return teacherRepository.save(defaultTeacher);
    }

    // Helper method to get teacher ID from Course entity
    @Transactional(readOnly = true)
    public Long getTeacherIdFromCourse(Course course) {
        return course.getTeacher() != null ? course.getTeacher().getId() : null;
    }
}
