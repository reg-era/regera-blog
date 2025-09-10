package com.backend.blog.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true, nullable=false)
    private String username;

    @Column(unique=true, nullable=false)
    private String email;

    @Column(nullable=false)
    private String passwordHash;

    @Column(nullable=false)
    private String role; // GUEST, BLOGGER, ADMIN

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters/Setters
    public String getEmail() {
        return email;
    }
}
