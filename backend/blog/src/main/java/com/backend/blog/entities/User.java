package com.backend.blog.entities;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Pattern;

import com.backend.blog.dto.UserDto;
import com.backend.blog.services.UserService;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    public static enum Role {
        BLOGGER, ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column
    private String bio;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, name = "password_hash")
    private String passwordHash;

    @Transient
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role = Role.BLOGGER;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$",
            Pattern.CASE_INSENSITIVE);

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Optional<String> isValidUser() {
        if (this.username == null || this.username.trim().length() < 5 || this.username.trim().length() > 20) {
            return Optional.of("Invalid username");
        }
        if (this.bio == null || this.bio.trim().length() > 200) {
            return Optional.of("Invalid bio");
        }

        if (this.email == null || this.email.trim().length() == 0 || !EMAIL_PATTERN.matcher(this.email).matches()) {
            return Optional.of("Invalid bio");
        }

        String pattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]+$";
        if (this.password == null || this.password.length() < 8 || !password.matches(pattern)) {
            return Optional.of("Invalid password");
        }
        return Optional.empty();
    }

    public UserDto toDto(boolean isFollowing, Long followers) {
        return new UserDto(
                this.username,
                this.email,
                this.bio,
                this.role.toString(),
                this.createdAt,
                isFollowing, followers);
    }

    public static User createAdmin() {
        String adminName = System.getenv("ADMIN_NAME");
        String adminEmail = System.getenv("ADMIN_EMAIL");
        String adminPassword = System.getenv("ADMIN_PASSWORD");
        if (adminName == null || adminEmail == null || adminPassword == null) {
            System.err.println("Cannot find admin infos");
            System.exit(1);
        }
        User admin = new User();
        admin.username = adminName;
        admin.email = adminEmail;
        admin.password = adminPassword;
        admin.role = User.Role.ADMIN;
        admin.bio = "This is the root admins for RegBlog";
        return admin;
    }

    @PrePersist
    private void hashPassword() {
        this.passwordHash = UserService.passwordEncoder.encode(this.password);
    }
}
