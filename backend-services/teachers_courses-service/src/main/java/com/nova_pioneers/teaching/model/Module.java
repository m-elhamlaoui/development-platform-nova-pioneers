package com.nova_pioneers.teaching.model;

import lombok.Data;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Data
@Setter
@Getter
@Table(name = "modules")
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    @Column(name = "sequence_order")
    private Integer sequenceOrder;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
    private List<Lesson> lessons;
}
