package com.nova_pioneers.parenting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RatingStatsResponse {
    @JsonProperty("average_rating")
    private Double averageRating;

    @JsonProperty("total_ratings")
    private Long totalRatings;

    // Constructors
    public RatingStatsResponse() {
    }

    public RatingStatsResponse(Double averageRating, Long totalRatings) {
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
    }

    // Getters and Setters
    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(Long totalRatings) {
        this.totalRatings = totalRatings;
    }
}