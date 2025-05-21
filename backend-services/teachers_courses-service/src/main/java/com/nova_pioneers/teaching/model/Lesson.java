package com.nova_pioneers.teaching.model;

import lombok.*;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "lessons")
@EqualsAndHashCode(exclude = {"contentSections", "course", "module"})
@ToString(exclude = {"contentSections", "course", "module"})
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    @Column(name = "resource_links")
    private String resourceLinks;
    private String image;
    @Column(name = "sequence_order")
    private Integer sequenceOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id")
    private Module module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceOrder ASC")
    private List<ContentSection> contentSections = new ArrayList<>();

    // Helper methods to maintain bidirectional relationship
    public void addContentSection(ContentSection section) {
        contentSections.add(section);
        section.setLesson(this);
    }

    public void removeContentSection(ContentSection section) {
        contentSections.remove(section);
        section.setLesson(null);
    }

    public void updateContentSections(List<ContentSection> sections) {
        contentSections.clear();
        if (sections != null) {
            for (ContentSection section : sections) {
                addContentSection(section);
            }
        }
    }

}