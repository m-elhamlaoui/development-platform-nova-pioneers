package com.nova_pioneers.teaching.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "lesson_contents")
@EqualsAndHashCode(exclude = { "lesson" })
@ToString(exclude = { "lesson" })
public class ContentSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subheading;

    @Column(length = 1000)
    private String text;
    @Column(name = "image_path")
    private String imagePath;
    @Column(name = "fun_fact", length = 500)
    private String funFact;

    @Column(name = "sequence_order")
    private Integer sequenceOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    // Add compatibility methods for image handling
    @Transient
    public String getImageUrl() {
        if (imagePath != null && !imagePath.isEmpty()) {
            return "/api/files/" + imagePath;
        }
        return null;
    }

    // Keep backward compatibility
    @Transient
    public String getImage() {
        return getImageUrl();
    }

    public void setImage(String image) {
        if (image != null && image.startsWith("/api/files/")) {
            this.imagePath = image.replace("/api/files/", "");
        } else if (image != null) {
            this.imagePath = image;
        }
    }
}
