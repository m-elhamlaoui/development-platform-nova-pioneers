// filepath: c:\Users\zackweb\Documents\win or die\development-platform-nova-pioneers\backend-services\admin-service\src\main\java\com\nova_pioneers\admin\entities\User.java
package com.nova_pioneers.admin.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Data
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String email;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "oauth_id")
    private String oauthId;

    @Column(name = "oauth_provider")
    private String oauthProvider;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "profile_picture")
    private String profilePicture;

    private String role;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}