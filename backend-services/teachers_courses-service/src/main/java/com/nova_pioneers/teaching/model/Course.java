package com.nova_pioneers.teaching.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String gradeLevel;
    private String subject;
    private LocalDate createdDate;

    // XP value for the course
    private Integer xpValue;

    // Size category (S, M, L)
    private String sizeCategory;

    // Age recommendation
    private Integer recommendedAge;

    // Relationship with Teacher
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    // Relationship with Modules
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Module> modules;
}
