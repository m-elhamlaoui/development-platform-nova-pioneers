package com.nova_pioneers.teaching.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Setter
@Getter

@Table(name = "ratings")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Rating value (e.g., 1-5 for stars, or 1-3 for emoji reactions)
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer ratingValue;

    // Optional comment with the rating
    private String comment;

    // References to the course and the user who made the rating
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // Store student/parent ID for the person who rated
    private Long userId;

    // Type of user (student or parent)
    private String userType;
}
