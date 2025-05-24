package com.nova_pioneers.teaching.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.nova_pioneers.teaching.DTO.ContentSectionDTO;
import com.nova_pioneers.teaching.DTO.CourseDTO;
import com.nova_pioneers.teaching.DTO.LessonDTO;
import com.nova_pioneers.teaching.Service.CourseService;

import com.nova_pioneers.teaching.Service.FileUploadService;
import com.nova_pioneers.teaching.model.Course;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;
    @Autowired
    private FileUploadService fileUploadService;
    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/detailed")
    public ResponseEntity<List<CourseDTO>> getAllCoursesDetailed() {
        return ResponseEntity.ok(courseService.getAllCoursesDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/detailed")
    public ResponseEntity<CourseDTO> getCourseByIdDetailed(@PathVariable Long id) {
        Optional<CourseDTO> course = courseService.getCourseByIdDTO(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Course>> getCoursesByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(courseService.getCoursesByTeacher(teacherId));
    }

    @GetMapping("/teacher/{teacherId}/detailed")
    public ResponseEntity<List<CourseDTO>> getCoursesByTeacherDetailed(@PathVariable Long teacherId) {
        return ResponseEntity.ok(courseService.getCoursesByTeacherDTO(teacherId));
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        return new ResponseEntity<>(courseService.saveCourse(course), HttpStatus.CREATED);
    }

    @PostMapping("/detailed")
    public ResponseEntity<CourseDTO> createCourseDetailed(@Valid @RequestBody CourseDTO courseDTO) {
        CourseDTO createdCourse = courseService.saveCourseWithDetails(courseDTO);

        // Debug logging
        if (createdCourse.getLessons() != null) {
            for (LessonDTO lesson : createdCourse.getLessons()) {
                System.out.println("Lesson '" + lesson.getTitle() + "' has " +
                        (lesson.getContent() != null ? lesson.getContent().size() : "null") +
                        " content sections");

                if (lesson.getContent() != null) {
                    for (int i = 0; i < lesson.getContent().size(); i++) {
                        ContentSectionDTO section = lesson.getContent().get(i);
                        System.out.println("  Section " + i + ": " +
                                (section.getSubheading() != null ? section.getSubheading() :
                                        section.getFunFact() != null ? "Fun fact" : "No title"));
                    }
                }
            }
        }

        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @Valid @RequestBody Course course) {
        Optional<Course> existingCourse = courseService.getCourseById(id);

        if (existingCourse.isPresent()) {
            course.setId(id);
            return ResponseEntity.ok(courseService.saveCourse(course));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/detailed")
    public ResponseEntity<CourseDTO> updateCourseDetailed(@PathVariable Long id, @Valid @RequestBody CourseDTO courseDTO) {
        Optional<Course> existingCourse = courseService.getCourseById(id);

        if (existingCourse.isPresent()) {
            courseDTO.setId(id);
            return ResponseEntity.ok(courseService.saveCourseWithDetails(courseDTO));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        Optional<Course> existingCourse = courseService.getCourseById(id);

        if (existingCourse.isPresent()) {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(courseService.searchCoursesByKeyword(keyword));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Course>> filterCourses(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String gradeLevel,
            @RequestParam(required = false) String sizeCategory,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge) {

        return ResponseEntity.ok(courseService.filterCourses(subject, gradeLevel, sizeCategory, minAge, maxAge));
    }


    @PostMapping(value = "/detailed/multipart", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CourseDTO> createCourseFromMultipart(
            @RequestParam("courseData") String courseDataJson,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnailFile,
            @RequestParam(value = "lessonImages", required = false) MultipartFile[] lessonImages,
            @RequestParam(value = "contentImages", required = false) MultipartFile[] contentImages,
            @RequestParam(value = "imageMapping", required = false) String imageMappingJson) {

        try {
            // Parse the course data from JSON string
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> frontendCourseData = objectMapper.readValue(courseDataJson, Map.class);

            // Transform frontend data to backend format
            CourseDTO courseDTO = transformFrontendToCourseDTO(frontendCourseData);

            // Handle file uploads and update image paths
            if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
                String thumbnailPath = fileUploadService.saveCourseImage(thumbnailFile, "thumbnail");
                courseDTO.setThumbnail("/api/files/" + thumbnailPath);
            }

            // Handle lesson and content images
            if (imageMappingJson != null) {
                Map<String, String> imageMapping = objectMapper.readValue(imageMappingJson, Map.class);
                updateImagePaths(courseDTO, lessonImages, contentImages, imageMapping);
            }

            // Create the course
            CourseDTO createdCourse = courseService.saveCourseWithDetails(courseDTO);

            return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);

        } catch (Exception e) {
            logger.error("Error creating course from multipart data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private CourseDTO transformFrontendToCourseDTO(Map<String, Object> frontendData) {
        CourseDTO courseDTO = new CourseDTO();

        // Basic fields
        courseDTO.setTitle((String) frontendData.get("title"));
        courseDTO.setDescription((String) frontendData.get("description"));

        // Transform field names and values
        courseDTO.setInstructor("Default Teacher"); // You might want to get this from auth context

        // Transform size category: "Medium" -> "M"
        String sizeCategory = (String) frontendData.get("size_category");
        courseDTO.setSize(transformSizeCategory(sizeCategory));

        // Handle lessons
        List<Map<String, Object>> frontendLessons = (List<Map<String, Object>>) frontendData.get("lessons");
        if (frontendLessons != null) {
            List<LessonDTO> lessonDTOs = transformLessons(frontendLessons);
            courseDTO.setLessons(lessonDTOs);
        }

        return courseDTO;
    }

    private String transformSizeCategory(String frontendSize) {
        if (frontendSize == null) return "M";
        switch (frontendSize.toLowerCase()) {
            case "small": return "S";
            case "medium": return "M";
            case "large": return "L";
            default: return "M";
        }
    }

    private List<LessonDTO> transformLessons(List<Map<String, Object>> frontendLessons) {
        List<LessonDTO> lessonDTOs = new ArrayList<>();

        for (Map<String, Object> frontendLesson : frontendLessons) {
            LessonDTO lessonDTO = new LessonDTO();
            lessonDTO.setTitle((String) frontendLesson.get("title"));
            lessonDTO.setSequenceOrder(((Number) frontendLesson.get("sequence_order")).intValue());

            // Transform lesson_contents to content
            List<Map<String, Object>> frontendContents = (List<Map<String, Object>>) frontendLesson.get("lesson_contents");
            if (frontendContents != null) {
                List<ContentSectionDTO> contentDTOs = transformContentSections(frontendContents);
                lessonDTO.setContent(contentDTOs);
            }

            lessonDTOs.add(lessonDTO);
        }

        return lessonDTOs;
    }

    private List<ContentSectionDTO> transformContentSections(List<Map<String, Object>> frontendContents) {
        List<ContentSectionDTO> contentDTOs = new ArrayList<>();

        for (Map<String, Object> frontendContent : frontendContents) {
            ContentSectionDTO contentDTO = new ContentSectionDTO();
            contentDTO.setSubheading((String) frontendContent.get("subheading"));
            contentDTO.setText((String) frontendContent.get("text"));
            contentDTO.setFunFact((String) frontendContent.get("fun_fact"));
            contentDTO.setSequenceOrder(((Number) frontendContent.get("sequence_order")).intValue());

            contentDTOs.add(contentDTO);
        }

        return contentDTOs;
    }

    private void updateImagePaths(CourseDTO courseDTO, MultipartFile[] lessonImages,
                                  MultipartFile[] contentImages, Map<String, String> imageMapping) {
        try {
            // Handle lesson images
            if (lessonImages != null && courseDTO.getLessons() != null) {
                for (int i = 0; i < Math.min(lessonImages.length, courseDTO.getLessons().size()); i++) {
                    if (lessonImages[i] != null && !lessonImages[i].isEmpty()) {
                        String imagePath = fileUploadService.saveLessonImage(lessonImages[i], "lesson");
                        courseDTO.getLessons().get(i).setImage("/api/files/" + imagePath);
                    }
                }
            }

            // Handle content images using mapping
            if (contentImages != null && imageMapping != null) {
                int imageIndex = 0;
                for (LessonDTO lesson : courseDTO.getLessons()) {
                    if (lesson.getContent() != null) {
                        for (ContentSectionDTO content : lesson.getContent()) {
                            String mappingKey = "content_" + lesson.getSequenceOrder() + "_" + content.getSequenceOrder();
                            if (imageMapping.containsKey(mappingKey) && imageIndex < contentImages.length) {
                                MultipartFile contentImage = contentImages[imageIndex];
                                if (contentImage != null && !contentImage.isEmpty()) {
                                    String imagePath = fileUploadService.saveContentImage(contentImage, "content");
                                    content.setImage("/api/files/" + imagePath);
                                }
                                imageIndex++;
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error updating image paths", e);
        }
    }
    @PostMapping(value = "/create-with-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createCourseWithFiles(
            @RequestParam("courseData") String courseDataJson,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnailFile,
            @RequestParam(value = "images", required = false) MultipartFile[] imageFiles) {

        try {
            logger.info("Creating course with files. CourseData: {}", courseDataJson);

            // Parse course data from JSON string
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> frontendCourseData = objectMapper.readValue(courseDataJson, Map.class);

            // Convert image array to list for easier handling
            List<MultipartFile> imagesList = new ArrayList<>();
            if (imageFiles != null) {
                imagesList.addAll(Arrays.asList(imageFiles));
            }

            // Add thumbnail to the beginning of images list if present
            if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
                imagesList.add(0, thumbnailFile);
            }

            // Create course using the service
            CourseDTO createdCourse = courseService.createCourseFromFrontend(
                    frontendCourseData,
                    thumbnailFile,
                    imagesList
            );

            // Return success response
            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Course created successfully",
                    "course", createdCourse
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            logger.error("Error creating course with files", e);

            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "error", e.getMessage()
            );

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * Alternative endpoint if you want to separate file upload from course creation
     */
    @PostMapping(value = "/create-simple", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CourseDTO> createCourseSimple(@Valid @RequestBody Map<String, Object> frontendData) {
        try {
            // Create course without file handling (images should be pre-uploaded)
            CourseDTO createdCourse = courseService.createCourseFromFrontend(frontendData, null, null);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
        } catch (Exception e) {
            logger.error("Error creating course", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}


