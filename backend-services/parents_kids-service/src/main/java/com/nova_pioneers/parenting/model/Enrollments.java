package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "kid_id", "course_id" })
})
@Data
@NoArgsConstructor
public class Enrollments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")
    private Long enrollmentId;

    @ManyToOne
    @JoinColumn(name = "kid_id")
    private Kidadd kid;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "enrolled_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime enrolledAt = ZonedDateTime.now();

    @Column(name = "completed_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime completedAt;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Column(name = "xp_earned")
    private Integer xpEarned = 0;
}
