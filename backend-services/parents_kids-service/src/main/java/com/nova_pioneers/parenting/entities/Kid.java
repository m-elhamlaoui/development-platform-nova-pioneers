package com.nova_pioneers.parenting.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "kids")
public class Kid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kid_id")
    private Integer kidId;

    @Column(name = "user_id", unique = true, nullable = false)
    private Integer userId;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    private String title;

    @Column(name = "total_xp")
    private Integer totalXp = 0;

    @Column(name = "is_restricted")
    private Boolean isRestricted = false;

    @Column(name = "parent_id", nullable = false)
    private Integer parentId;

    // Constructors
    public Kid() {
    }

    // Getters and Setters
    public Integer getKidId() {
        return kidId;
    }

    public void setKidId(Integer kidId) {
        this.kidId = kidId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(Integer totalXp) {
        this.totalXp = totalXp;
    }

    public Boolean getIsRestricted() {
        return isRestricted;
    }

    public void setIsRestricted(Boolean isRestricted) {
        this.isRestricted = isRestricted;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }
}