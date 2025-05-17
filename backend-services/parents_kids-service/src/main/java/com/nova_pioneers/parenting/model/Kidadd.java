package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "kids")
public class Kidadd { // Consider renaming to 'Kid' for clarity

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "kid_id")
    private Long kidId; // Renamed from kid_id to match findByKidId

    // Remove @OneToOne on kid_id; add a separate foreign key for the relationship
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", unique = true) // Use a separate column
    private Registerkid user;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "total_xp")
    private Integer totalXp = 0;

    @Column(name = "is_restricted")
    private Integer isRestricted = 1;

    // Getters and setters
    public Long getKidId() {
        return kidId;
    }

    public void setKidId(Long kidId) {
        this.kidId = kidId;
    }

    public Registerkid getUser() {
        return user;
    }

    public void setUser(Registerkid user) {
        this.user = user;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Integer getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(Integer totalXp) {
        this.totalXp = totalXp;
    }

    public Integer getIsRestricted() {
        return isRestricted;
    }

    public void setIsRestricted(Integer isRestricted) {
        this.isRestricted = isRestricted;
    }
}