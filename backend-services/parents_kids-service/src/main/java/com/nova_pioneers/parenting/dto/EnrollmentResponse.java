package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EnrollmentResponse {
    @JsonProperty("enrollment_id")
    private Integer enrollmentId;

    @JsonProperty("course_id")
    private Integer courseId;

    @JsonProperty("course_title")
    private String courseTitle;

    @JsonProperty("enrolled_at")
    private String enrolledAt;

    @JsonProperty("completed_at")
    private String completedAt;

    @JsonProperty("progress_percentage")
    private Integer progressPercentage;

    @JsonProperty("xp_earned")
    private Integer xpEarned;

    @JsonProperty("last_completed_lesson_id")
    private Integer lastCompletedLessonId;

    // Constructors
    public EnrollmentResponse() {
    }

    // Getters and Setters
    public Integer getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Integer enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(String enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public String getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(String completedAt) {
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