package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ToggleRestrictionResponse {
    @JsonProperty("user_id")
    private Integer userId;

    @JsonProperty("kid_id")
    private Integer kidId;

    private String message;

    @JsonProperty("is_restricted")
    private Integer isRestricted;

    // Constructors
    public ToggleRestrictionResponse() {
    }

    public ToggleRestrictionResponse(Integer userId, Integer kidId, String message, Integer isRestricted) {
        this.userId = userId;
        this.kidId = kidId;
        this.message = message;
        this.isRestricted = isRestricted;
    }

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getKidId() {
        return kidId;
    }

    public void setKidId(Integer kidId) {
        this.kidId = kidId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getIsRestricted() {
        return isRestricted;
    }

    public void setIsRestricted(Integer isRestricted) {
        this.isRestricted = isRestricted;
    }
}