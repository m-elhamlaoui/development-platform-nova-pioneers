package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   
    @Column(name="Title")
    private String title;

    @Column(name="Description")
    private String description;

    @Column(name = "grade_level")
    private String gradeLevel;

    @Column(name="Subject")
    private String subject;

    @Column(name = "createdDate")
    private LocalDate createdDate;

    
    @Column(name = "xp_value", nullable = false)
    private Integer xpValue = 0;

    @Column(name = "size_category", nullable = false, length = 1)
    private String sizeCategory;

    @Column(name = "recommended_age", nullable = false)
    private Integer recommendedAge;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teachers teacher;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGradeLevel() {
        return gradeLevel;
    }

    public void setGradeLevel(String gradeLevel) {
        this.gradeLevel = gradeLevel;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getXpValue() {
        return xpValue;
    }

    public void setXpValue(Integer xpValue) {
        this.xpValue = xpValue;
    }

    public String getSizeCategory() {
        return sizeCategory;
    }

    public void setSizeCategory(String sizeCategory) {
        this.sizeCategory = sizeCategory;
    }

    public Integer getRecommendedAge() {
        return recommendedAge;
    }

    public void setRecommendedAge(Integer recommendedAge) {
        this.recommendedAge = recommendedAge;
    }

    public Teachers getTeacher() {
        return teacher;
    }

    public void setTeacher(Teachers teacher) {
        this.teacher = teacher;
    }
}
