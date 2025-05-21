package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;

import java.time.ZonedDateTime;

@Entity
@Table(name = "course_reports")
public class CourseReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @ManyToOne
    @JoinColumn(name="courseId")
    private Course course;


    @OneToOne
    @JoinColumn(name = "enrollment_id")
    private Enrollments enrollment;

    @Column(name = "subject_report")
    private String subjectReport;

    @Column(name = "desc_report")
    private String descReport;

    @Column(name = "created_at")
    private ZonedDateTime createdAt = ZonedDateTime.now();

    // Getters and Setters

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Enrollments getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(Enrollments enrollment) {
        this.enrollment = enrollment;
    }
   
    public String getSubjectReport() {
        return subjectReport;
    }

    public void setSubjectReport(String subjectReport) {
        this.subjectReport = subjectReport;
    }

    public String getDescReport() {
        return descReport;
    }

    public void setDescReport(String descReport) {
        this.descReport = descReport;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public Course getCourse() {
        return course;
    }
    public void setCourse(Course course) {
        this.course = course;

}
}

