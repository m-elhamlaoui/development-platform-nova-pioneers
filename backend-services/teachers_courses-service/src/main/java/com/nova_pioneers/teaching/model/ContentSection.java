package com.nova_pioneers.teaching.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Setter
@Getter
@Table(name = "content_sections")
public class ContentSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subheading;
    private String text;
    private String image;
    private String funFact;
    private Integer sequenceOrder;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}
