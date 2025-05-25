package com.nova_pioneers.parenting.service;

import com.nova_pioneers.parenting.repositories.CourseRepository;
import com.nova_pioneers.parenting.repositories.RatingRepository;
import com.nova_pioneers.parenting.model.Course;
import com.nova_pioneers.parenting.model.CourseRating;
import com.nova_pioneers.parenting.model.Registerkid;
import com.nova_pioneers.parenting.repositories.CourseReportRepository;
import com.nova_pioneers.parenting.repositories.Registrationrepository;
import com.nova_pioneers.parenting.model.CourseReport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class RatingandReportService {
    private static final Logger log = LoggerFactory.getLogger(RatingandReportService.class);

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private CourseReportRepository coursereportRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private Registrationrepository registrationrepository;

    public List<CourseRating> getRatingsByCourse(Long courseId) {
        log.info("Getting ratings for course ID: {}", courseId);
        return ratingRepository.findByCourse_CourseId(courseId);
    }

    public List<CourseRating> getRatingsByUser(Long userId) {
        log.info("Getting ratings for user ID: {}", userId);
        // First get the user entity
        Optional<Registerkid> user = registrationrepository.findById(userId);
        if (user.isEmpty()) {
            log.error("User not found with ID: {}", userId);
            throw new RuntimeException("User not found with id: " + userId);
        }

        // Then use it to find ratings
        return ratingRepository.findByUserId(user.get());
    }

    @Transactional
    public CourseRating saveRating(CourseRating rating, Long courseId) {
        log.info("Saving rating for course ID: {}", courseId);
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isEmpty()) {
            log.error("Course not found with ID: {}", courseId);
            throw new RuntimeException("Course not found with id: " + courseId);
        }

        rating.setCourse(course.get());
        return ratingRepository.save(rating);
    }

    @Transactional
    public void deleteRating(Long id) {
        log.info("Deleting rating with ID: {}", id);
        ratingRepository.deleteById(id);
    }

    public List<CourseReport> getReportsByCourse(Long courseId) {
        log.info("Getting reports for course ID: {}", courseId);
        return coursereportRepository.findByCourseId(courseId);
    }

    @Transactional
    public CourseReport saveReport(CourseReport report, Long courseId) {
        log.info("Saving report for course ID: {}", courseId);
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isEmpty()) {
            log.error("Course not found with ID: {}", courseId);
            throw new RuntimeException("Course not found with id: " + courseId);
        }

        report.setCourse(course.get());
        return coursereportRepository.save(report);
    }

    @Transactional
    public void deleteReport(Long reportId) {
        log.info("Deleting report with ID: {}", reportId);
        coursereportRepository.deleteById(reportId);
    }
}
