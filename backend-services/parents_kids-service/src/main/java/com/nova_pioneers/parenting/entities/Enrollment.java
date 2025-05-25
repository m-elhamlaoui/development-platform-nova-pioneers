package com.nova_pioneers.parenting.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")
    private Integer enrollmentId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "course_id")
    private Integer courseId;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Column(name = "xp_earned")
    private Integer xpEarned = 0;

    @Column(name = "last_completed_lesson_id")
    private Integer lastCompletedLessonId;

    // Constructors, getters, setters
    public Enrollment() {
    }

    public Integer getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Integer enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Integer getXpEarned() {
        return xpEarned;
    }

    public void setXpEarned(Integer xpEarned) {
        this.xpEarned = xpEarned;
    }

    public Integer getLastCompletedLessonId() {
        return lastCompletedLessonId;
    }

    public void setLastCompletedLessonId(Integer lastCompletedLessonId) {
        this.lastCompletedLessonId = lastCompletedLessonId;
    }
}