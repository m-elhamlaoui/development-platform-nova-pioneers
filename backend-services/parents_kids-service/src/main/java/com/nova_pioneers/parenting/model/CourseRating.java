package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ratings")
@Data
@NoArgsConstructor
public class CourseRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;

    @Column(name = "rating_value")
    private Integer ratingValue;

    @Column(name = "comment")
    private String comment;

    @ManyToOne
    @JoinColumn(name = "courseId")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Registerkid userId; // This field name doesn't match standard conventions

    @Column(name = "user_type")
    private String userType;
}
