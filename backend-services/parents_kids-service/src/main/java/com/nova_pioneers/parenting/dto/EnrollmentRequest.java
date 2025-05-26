package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EnrollmentRequest {
    @JsonProperty("course_id")
    private Integer courseId;

    // Constructors
    public EnrollmentRequest() {
    }

    // Getters and Setters
    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }
}