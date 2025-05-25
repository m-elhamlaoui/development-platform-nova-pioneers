package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class LessonResponse {
    private Integer id;
    private String title;
    private String content;

    @JsonProperty("resource_links")
    private List<String> resourceLinks;

    @JsonProperty("lesson_contents")
    private List<LessonContentResponse> lessonContents;

    // Constructors
    public LessonResponse() {
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public List<String> getResourceLinks() {
        return resourceLinks;
    }

    public void setResourceLinks(List<String> resourceLinks) {
        this.resourceLinks = resourceLinks;
    }

    public List<LessonContentResponse> getLessonContents() {
        return lessonContents;
    }

    public void setLessonContents(List<LessonContentResponse> lessonContents) {
        this.lessonContents = lessonContents;
    }
}