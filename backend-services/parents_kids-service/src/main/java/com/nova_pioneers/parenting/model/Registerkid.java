package com.nova_pioneers.parenting.model;

import java.time.OffsetDateTime;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class Registerkid {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long user_id;
    private String email;
    private String password_hash;
    private String first_name;
    private String last_name;
    private String role;

    @CreationTimestamp
    private OffsetDateTime created_at;
    private Boolean is_active;
    private String oauth_provider;

    // Change to String to match the database
    private String oauth_id; // Changed from Integer to String

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Kidadd kid;
}