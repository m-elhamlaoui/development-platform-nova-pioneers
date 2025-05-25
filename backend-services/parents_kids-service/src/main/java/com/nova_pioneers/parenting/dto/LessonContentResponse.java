package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LessonContentResponse {
    private String subheading;
    private String text;

    @JsonProperty("image_path")
    private String imagePath;

    @JsonProperty("fun_fact")
    private String funFact;

    // Constructors
    public LessonContentResponse() {
    }

    // Getters and Setters
    public String getSubheading() {
        return subheading;
    }

    public void setSubheading(String subheading) {
        this.subheading = subheading;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getFunFact() {
        return funFact;
    }

    public void setFunFact(String funFact) {
        this.funFact = funFact;
    }
}