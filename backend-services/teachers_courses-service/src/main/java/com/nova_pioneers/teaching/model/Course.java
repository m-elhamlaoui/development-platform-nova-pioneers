package com.nova_pioneers.teaching.model;

import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@Setter
@Getter
@EqualsAndHashCode(exclude = { "modules", "lessons", "ratings" })
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course title is required")

    private String title;

    @NotBlank(message = "Course description is required")
    private String description;

    @Column(name = "thumbnail_path")
    private String thumbnailPath;

    @Column(name = "grade_level")
    @NotBlank(message = "Grade level is required")
    private String gradeLevel;

    @NotBlank(message = "Subject is required")
    private String subject;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "xp_value")
    @Min(value = 0, message = "XP value cannot be negative")
    private Integer xpValue;

    @Column(name = "size_category")
    private String sizeCategory;

    @Column(name = "recommended_age")
    private Integer recommendedAge;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @NotNull(message = "Teacher is required")
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    @JsonIgnore
    private Teacher teacher;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Module> modules;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceOrder ASC")
    @JsonManagedReference  // Add this annotation
    private List<Lesson> lessons;

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

    // Helper method to get number of reviews
    @Transient
    public Integer getReviewCount() {
        return ratings != null ? ratings.size() : 0;
    }

    // Helper method to get instructor name
    @Transient
    public String getInstructorName() {
        return teacher != null ? teacher.getFirstName() + " " + teacher.getLastName() : "";
    }

    // Helper method to get full thumbnail URL
    @Transient
    public String getThumbnailUrl() {
        if (thumbnailPath != null && !thumbnailPath.isEmpty()) {
            return "/api/files/" + thumbnailPath;
        }
        return null;
    }

    // Keep backward compatibility for existing code
    @Transient
    public String getThumbnail() {
        return getThumbnailUrl();
    }

    public void setThumbnail(String thumbnail) {
        // If it's a full URL, extract the path part
        if (thumbnail != null && thumbnail.startsWith("/api/files/")) {
            this.thumbnailPath = thumbnail.replace("/api/files/", "");
        } else if (thumbnail != null) {
            this.thumbnailPath = thumbnail;
        }
    }

    // Add this helper method to your Course entity
    @Transactional
    public Long getTeacherId() {
        return teacher != null ? teacher.getId() : null;
    }

    // You cannot have a setTeacherId method with @ManyToOne relationship
    // Instead, use setTeacher(Teacher teacher)
}
