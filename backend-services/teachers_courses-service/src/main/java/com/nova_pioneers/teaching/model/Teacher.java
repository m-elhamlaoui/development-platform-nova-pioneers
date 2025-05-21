package com.nova_pioneers.teaching.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Entity
@Data
@Setter
@Getter
@Table(name = "teachers")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;

    @Column(name = "certification_info")
    private String certificationInfo;

    @Column(name = "join_date")
    private LocalDate joinDate;

    // Teacher's accumulated XP
    @Column(name = "accumulated_xp")
    private Integer accumulatedXp;

    // Teacher title (Beginner, Super, Great, etc.)
    private String title;

    @OneToMany(mappedBy = "teacher")
    private List<Course> courses;
}
