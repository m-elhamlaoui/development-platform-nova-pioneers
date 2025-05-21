package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "teachers")
public class Teachers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teacherId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Registerkid user;

    @Column(name="username")
    private String username;

    @Column(name="email")
    private String email;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "certification_info")
    private String certificationInfo;

    @Column(name = "join_date")
    private LocalDate joinDate;

    @Column(name = "accumulated_xp")
    private Integer accumulatedXp = 0;

    @Column(length = 50)
    private String title;

    // Getters and Setters

    public Long getId() {
        return teacherId;
    }

    public void setId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public Registerkid getUser() {
        return user;
    }

    public void setUser(Registerkid user) {
        this.user = user;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getCertificationInfo() {
        return certificationInfo;
    }

    public void setCertificationInfo(String certificationInfo) {
        this.certificationInfo = certificationInfo;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }

    public Integer getAccumulatedXp() {
        return accumulatedXp;
    }

    public void setAccumulatedXp(Integer accumulatedXp) {
        this.accumulatedXp = accumulatedXp;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
