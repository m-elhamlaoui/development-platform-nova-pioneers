package com.nova_pioneers.parenting.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Keep just the direct column mapping:
    @Column(name = "course_id")
    private Integer courseId;

    private String title;

    private String content;

    @Column(name = "resource_links", columnDefinition = "TEXT")
    private String resourceLinks; // JSON array as string

    @Column(name = "sequence_order")
    private Integer sequenceOrder;

    // Constructors, getters, setters
    public Lesson() {
    }

    // Existing getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getResourceLinks() {
        return resourceLinks;
    }

    public void setResourceLinks(String resourceLinks) {
        this.resourceLinks = resourceLinks;
    }

    public Integer getSequenceOrder() {
        return sequenceOrder;
    }

    public void setSequenceOrder(Integer sequenceOrder) {
        this.sequenceOrder = sequenceOrder;
    }
}