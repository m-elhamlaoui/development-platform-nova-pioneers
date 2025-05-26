package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateRatingRequest {
    @JsonProperty("rating_value")
    private Integer ratingValue;

    private String comment;

    @JsonProperty("user_type")
    private String userType;

    // Constructors
    public CreateRatingRequest() {
    }

    // Getters and Setters
    public Integer getRatingValue() {
        return ratingValue;
    }

    public void setRatingValue(Integer ratingValue) {
        this.ratingValue = ratingValue;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}