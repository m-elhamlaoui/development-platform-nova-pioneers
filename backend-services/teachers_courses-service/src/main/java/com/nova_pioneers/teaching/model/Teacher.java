package com.nova_pioneers.teaching.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "teachers")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String certificationInfo;
    private LocalDate joinDate;

    // Teacher's accumulated XP
    private Integer accumulatedXp;

    // Teacher title (Beginner, Super, Great, etc.)
    private String title;

    @OneToMany(mappedBy = "teacher")
    private List<Course> courses;
}
