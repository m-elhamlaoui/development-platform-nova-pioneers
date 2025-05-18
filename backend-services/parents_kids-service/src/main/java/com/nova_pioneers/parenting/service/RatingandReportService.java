package com.nova_pioneers.parenting.service;

import java.time.ZonedDateTime;

import org.springframework.stereotype.Service;

import com.nova_pioneers.parenting.model.CourseRating;

import com.nova_pioneers.parenting.model.Course;
import com.nova_pioneers.parenting.model.CourseReport;
import com.nova_pioneers.parenting.repositories.CourseReportRepository;
import com.nova_pioneers.parenting.repositories.EnrollmentRepository;
import com.nova_pioneers.parenting.repositories.RatingRepository;
import com.nova_pioneers.parenting.model.Enrollments;
import com.nova_pioneers.parenting.repositories.CourseRepository;

import java.util.List;



    @Service
public class RatingAndReportService {

    private final RatingRepository ratingRepo;
    private final CourseReportRepository reportRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final CourseRepository courseRepo;

    public RatingAndReportService(RatingRepository ratingRepo, 
                                  CourseReportRepository reportRepo,
                                  EnrollmentRepository enrollmentRepo,
                                  CourseRepository courseRepo) {
        this.ratingRepo = ratingRepo;
        this.reportRepo = reportRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.courseRepo = courseRepo;
    }

    public CourseRating rateCourse(Long userId, Long courseId, int ratingValue, String comment, String userType) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseRating rating = ratingRepo.findByUserIdAndCourseId(userId, courseId)
                .orElse(new CourseRating());

        rating.setUserId(userId);
        rating.setUserType(userType);
        rating.setCourse(course);
        rating.setRatingValue(ratingValue);
        rating.setComment(comment);

        return ratingRepo.save(rating);
    }

    public CourseReport reportCourse(Long enrollmentId, String subject, String desc) {
        Enrollments enrollment = enrollmentRepo.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        CourseReport report = new CourseReport();
        report.setEnrollment(enrollment);
        report.setSubjectReport(subject);
        report.setDescReport(desc);
        report.setCreatedAt(ZonedDateTime.now());

        return reportRepo.save(report);
    }

    public List<CourseReport> getReportsForKid(Long kidId) {
        return reportRepo.findByEnrollmentKidKidId(kidId);
    }
}

    
