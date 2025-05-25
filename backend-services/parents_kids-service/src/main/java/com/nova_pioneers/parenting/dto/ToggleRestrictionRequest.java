package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ToggleRestrictionRequest {
    @JsonProperty("is_restricted")
    private Boolean isRestricted;

    // Constructors
    public ToggleRestrictionRequest() {
    }

    public ToggleRestrictionRequest(Boolean isRestricted) {
        this.isRestricted = isRestricted;
    }

    // Getters and Setters
    public Boolean getIsRestricted() {
        return isRestricted;
    }

    public void setIsRestricted(Boolean isRestricted) {
        this.isRestricted = isRestricted;
    }
}