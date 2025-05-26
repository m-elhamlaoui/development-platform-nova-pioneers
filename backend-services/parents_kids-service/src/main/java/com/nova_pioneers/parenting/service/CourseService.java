package com.nova_pioneers.parenting.service;

import com.nova_pioneers.parenting.dto.*;
import com.nova_pioneers.parenting.entities.*;
import com.nova_pioneers.parenting.repositories.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private KidRepository kidRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private LessonContentRepository lessonContentRepository;

    @Autowired
    private RatingRepository ratingRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<CourseResponse> getCoursesForKid(Integer kidUserId, String gradeLevel, String subject, String search) {
        // Check if kid is restricted
        Kid kid = kidRepository.findByUserId(kidUserId)
                .orElseThrow(() -> new RuntimeException("Kid not found"));

        List<Course> courses;

        if (kid.getIsRestricted() == 1) {
            // For restricted kids, implement logic to get only assigned courses
            // For now, we'll return an empty list
            return List.of();
        } else {
            // Return all courses with filters
            courses = courseRepository.findCoursesWithFilters(gradeLevel, subject, search);
        }

        // Convert to DTO with all fields
        return courses.stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    public List<CourseResponse> getAllCourses() {
        // Fetch all active courses
        List<Course> courses = courseRepository.findByIsActiveTrue();

        // Convert to DTO with all fields
        return courses.stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    public CourseDetailResponse getCourseDetails(Integer courseId) {
        Course course = courseRepository.findByIdAndIsActiveTrue(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Teacher teacher = null;
        if (course.getTeacherId() != null) {
            teacher = teacherRepository.findById(course.getTeacherId()).orElse(null);
        }

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceOrder(courseId);

        Double averageRating = ratingRepository.getAverageRatingByCourseId(courseId);

        CourseDetailResponse response = new CourseDetailResponse();
        response.setId(course.getId());
        response.setTeacherId(course.getTeacherId());
        response.setTeacherName(teacher != null ? teacher.getName() : "Unknown");
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setGradeLevel(course.getGradeLevel());
        response.setSubject(course.getSubject());
        response.setThumbnail(course.getThumbnail());
        response.setCreatedDate(course.getCreatedDate().toString());
        response.setXpValue(course.getXpValue());
        response.setSizeCategory(course.getSizeCategory());
        response.setRecommendedAge(course.getRecommendedAge());
        response.setAverageRating(averageRating != null ? averageRating : 0.0);
        response.setLessons(lessons.stream().map(this::mapToLessonResponse).collect(Collectors.toList()));

        return response;
    }

    private CourseResponse mapToCourseResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setTeacherId(course.getTeacherId());

        // Get teacher name if available
        Teacher teacher = null;
        if (course.getTeacherId() != null) {
            teacher = teacherRepository.findById(course.getTeacherId()).orElse(null);
        }
        response.setTeacherName(teacher != null ? teacher.getName() : "Unknown");

        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setGradeLevel(course.getGradeLevel());
        response.setSubject(course.getSubject());
        response.setThumbnail(course.getThumbnail());

        // Include all additional course details
        response.setCreatedDate(course.getCreatedDate() != null ? course.getCreatedDate().toString() : null);
        response.setXpValue(course.getXpValue());
        response.setSizeCategory(course.getSizeCategory());
        response.setRecommendedAge(course.getRecommendedAge());
        response.setIsActive(course.getIsActive());

        // Get ratings data
        Double averageRating = ratingRepository.getAverageRatingByCourseId(course.getId());
        Long reviewCount = ratingRepository.countByCourseId(course.getId());

        response.setAverageRating(averageRating != null ? averageRating : 0.0);
        response.setReviews(reviewCount != null ? reviewCount.intValue() : 0);

        return response;
    }

    private LessonResponse mapToLessonResponse(Lesson lesson) {
        LessonResponse response = new LessonResponse();
        response.setId(lesson.getId());
        response.setTitle(lesson.getTitle());
        response.setContent(lesson.getContent());

        // Parse resource links from JSON string
        try {
            if (lesson.getResourceLinks() != null) {
                List<String> resourceLinks = objectMapper.readValue(
                        lesson.getResourceLinks(),
                        new TypeReference<List<String>>() {
                        });
                response.setResourceLinks(resourceLinks);
            }
        } catch (Exception e) {
            // Handle JSON parsing error
            response.setResourceLinks(List.of());
        }

        // Get lesson contents
        List<LessonContent> contents = lessonContentRepository.findByLessonIdOrderBySequenceOrder(lesson.getId());
        response.setLessonContents(contents.stream()
                .map(this::mapToLessonContentResponse)
                .collect(Collectors.toList()));

        return response;
    }

    private LessonContentResponse mapToLessonContentResponse(LessonContent content) {
        LessonContentResponse response = new LessonContentResponse();
        response.setSubheading(content.getSubheading());
        response.setText(content.getText());
        response.setImagePath(content.getImagePath());
        response.setFunFact(content.getFunFact());
        return response;
    }
}