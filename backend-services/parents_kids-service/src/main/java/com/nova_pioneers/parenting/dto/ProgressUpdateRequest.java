package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProgressUpdateRequest {
    @JsonProperty("last_completed_lesson_id")
    private Integer lastCompletedLessonId;

    @JsonProperty("progress_percentage")
    private Integer progressPercentage;

    @JsonProperty("xp_earned")
    private Integer xpEarned;

    // Constructors
    public ProgressUpdateRequest() {
    }

    // Getters and Setters
    public Integer getLastCompletedLessonId() {
        return lastCompletedLessonId;
    }

    public void setLastCompletedLessonId(Integer lastCompletedLessonId) {
        this.lastCompletedLessonId = lastCompletedLessonId;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Integer getXpEarned() {
        return xpEarned;
    }

    public void setXpEarned(Integer xpEarned) {
        this.xpEarned = xpEarned;
    }
}