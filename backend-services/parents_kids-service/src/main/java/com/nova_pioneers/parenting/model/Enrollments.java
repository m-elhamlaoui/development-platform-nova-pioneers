package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"kid_id", "course_id"})
})
public class Enrollments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")
    private Long enrollmentId;

    @ManyToOne
    @JoinColumn(name = "kid_id", nullable = false)
    private Kidadd kid;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "enrolled_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime enrolledAt = ZonedDateTime.now();

    @Column(name = "completed_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime completedAt;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Column(name = "xp_earned")
    private Integer xpEarned = 0;

    // Getters and Setters

    public Long getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Long enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public Kidadd getKid() {
        return kid;
    }

    public void setKid(Kidadd kid) {
        this.kid = kid;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public ZonedDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(ZonedDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public ZonedDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(ZonedDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Integer getXpEarned() {
        return xpEarned;
    }

    public void setXpEarned(Integer xpEarned) {
        this.xpEarned = xpEarned;
    }
}
