package com.nova_pioneers.parenting.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "kids")
@Data
@NoArgsConstructor
public class Kidadd {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "kid_id")
    private Long kidId;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", unique = true)
    private Registerkid user;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "total_xp")
    private Integer totalXp = 0;

    @Column(name = "is_restricted")
    private Integer isRestricted = 1;
}