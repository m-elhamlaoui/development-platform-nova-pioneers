package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ToggleRestrictionRequest {
    @JsonProperty("is_restricted")
    private Integer isRestricted;

    // Constructors
    public ToggleRestrictionRequest() {
    }

    public ToggleRestrictionRequest(Integer isRestricted) {
        this.isRestricted = isRestricted;
    }

    // Getters and Setters
    public Integer getIsRestricted() {
        return isRestricted;
    }

    public void setIsRestricted(Integer isRestricted) {
        this.isRestricted = isRestricted;
    }
}