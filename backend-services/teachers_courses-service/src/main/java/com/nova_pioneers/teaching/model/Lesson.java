package com.nova_pioneers.teaching.model;

import lombok.Data;
import jakarta.persistence.*;

@Entity
@Data
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String resourceLinks;
    private Integer sequenceOrder;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;
}
