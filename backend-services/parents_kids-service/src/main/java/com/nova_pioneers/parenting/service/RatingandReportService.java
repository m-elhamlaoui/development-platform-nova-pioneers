package com.nova_pioneers.parenting.service;

import com.nova_pioneers.parenting.repositories.CourseRepository;
import com.nova_pioneers.parenting.repositories.RatingRepository;
import com.nova_pioneers.parenting.repositories.CourseReportRepository;
import com.nova_pioneers.parenting.model.Course;
import com.nova_pioneers.parenting.model.CourseRating;
import com.nova_pioneers.parenting.model.CourseReport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RatingandReportService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private CourseReportRepository coursereportRepository;

    @Autowired
    private CourseRepository courseRepository;

   
    public List<CourseRating> getRatingsByCourse(Long courseId) {
        return ratingRepository.findByCourseId(courseId);
    }

   
    public CourseRating saveRating(CourseRating rating, Long courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (!course.isPresent()) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }

        rating.setCourse(course.get());
        return ratingRepository.save(rating);
    }

    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }

   
    public List<CourseReport> getReportsByCourse(Long courseId) {
        return coursereportRepository.findByCourseId(courseId);
    }

   
    public CourseReport saveReport(CourseReport report, Long courseId) {
        Optional<Course> course = courseRepository.findById(courseId);
        if (!course.isPresent()) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }

        report.setCourse(course.get());
        return coursereportRepository.save(report);
    }

    public void deleteReport(Long reportId) {
        coursereportRepository.deleteById(reportId);
    }
}
