package com.nova_pioneers.teaching.model;

import lombok.Data;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Data
@Table(name = "modules")
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Integer sequenceOrder;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
    private List<Lesson> lessons;
}
