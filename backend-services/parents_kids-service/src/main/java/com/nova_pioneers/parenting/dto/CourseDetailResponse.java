package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class CourseDetailResponse {
    private Integer id;
    
    @JsonProperty("teacher_id")
    private Integer teacherId;
    
    @JsonProperty("teacher_name")
    private String teacherName;
    
    private String title;
    private String description;
    
    @JsonProperty("grade_level")
    private String gradeLevel;
    
    private String subject;
    private String thumbnail;
    
    @JsonProperty("created_date")
    private String createdDate;
    
    @JsonProperty("xp_value")
    private Integer xpValue;
    
    @JsonProperty("size_category")
    private String sizeCategory;
    
    @JsonProperty("recommended_age")
    private Integer recommendedAge;
    
    @JsonProperty("average_rating")
    private Double averageRating;
    
    private List<LessonResponse> lessons;

    // Constructors
    public CourseDetailResponse() {}

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getTeacherId() { return teacherId; }
    public void setTeacherId(Integer teacherId) { this.teacherId = teacherId; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(String gradeLevel) { this.gradeLevel = gradeLevel; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }

    public Integer getXpValue() { return xpValue; }
    public void setXpValue(Integer xpValue) { this.xpValue = xpValue; }

    public String getSizeCategory() { return sizeCategory; }
    public void setSizeCategory(String sizeCategory) { this.sizeCategory = sizeCategory; }

    public Integer getRecommendedAge() { return recommendedAge; }
    public void setRecommendedAge(Integer recommendedAge) { this.recommendedAge = recommendedAge; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public List<LessonResponse> getLessons() { return lessons; }
    public void setLessons(List<LessonResponse> lessons) { this.lessons = lessons; }
}