package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;



@Entity
@Table(name = "ratings")
public class CourseRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;

    @Column(name = "rating_value")
    private Integer ratingValue;

    @Column(name="comment")
    private String comment;

    @ManyToOne
    @JoinColumn(name = "courseId")
    private Course course;
     
    @ManyToOne
    @Column(name = "user_id")
    private Registerkid userId; 

    



    @Column(name = "user_type")
    private String userType; 

    // Getters and Setters


    public Long getRatingId() {
        return ratingId;
    }

    public void setRatingId(Long ratingId) {
        this.ratingId = ratingId;
    }

    public Integer getRatingValue() {
        return ratingValue;
    }

    public void setRatingValue(Integer ratingValue) {
        this.ratingValue = ratingValue;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getUserType() {
        return userType;
    }
    public void setUserType(String userType) {
        this.userType = userType;
    }

    public Registerkid getUserId() {
        return userId;
    }
    public void setUserId(Registerkid userId) {
        this.userId = userId;
    }


}



