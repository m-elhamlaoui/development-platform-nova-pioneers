package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "course")
@Data
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "grade_level")
    private String gradeLevel;

    @Column(name = "subject")
    private String subject;

    @Column(name = "createdDate")
    private LocalDate createdDate;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<CourseRating> ratings;

    @Column(name = "xp_value")
    private Integer xpValue = 0;

    @Column(name = "size_category")
    private String sizeCategory;

    @Column(name = "recommended_age")
    private Integer recommendedAge;

    @ManyToOne
    @JoinColumn(name = "teacherId")
    private Teachers teacher;

    // Keep these methods for backward compatibility
    public Long getId() {
        return courseId;
    }

    public void setId(Long courseId) {
        this.courseId = courseId;
    }
}
