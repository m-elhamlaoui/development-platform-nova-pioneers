package com.nova_pioneers.teaching.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;
import org.hibernate.annotations.processing.Pattern;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Course description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    @NotBlank(message = "Grade level is required")
    private String gradeLevel;

    @NotBlank(message = "Subject is required")
    private String subject;

    private LocalDate createdDate;

    @Min(value = 0, message = "XP value cannot be negative")
    private Integer xpValue;

    @Pattern(regexp = "^[SML]$", message = "Size category must be S, M, or L")
    private String sizeCategory;

    @Min(value = 4, message = "Minimum recommended age is 4")
    @Max(value = 18, message = "Maximum recommended age is 18")
    private Integer recommendedAge;

    @NotNull(message = "Teacher is required")
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Module> modules;
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Rating> ratings;

    // Helper method to calculate average rating
    @Transient
    public Double getAverageRating() {
        if (ratings == null || ratings.isEmpty()) {
            return 0.0;
        }
        double sum = ratings.stream()
                .mapToInt(Rating::getRatingValue)
                .sum();
        return sum / ratings.size();
    }
}
