package com.backend.blog.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Table(name = "blogs")
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column
    private String description;

    @Column
    private String cover;

    @Column
    private String media;

    @Column(nullable = false)
    private String content;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Blog() {
    }

    public Blog(Long id,
            User user,
            String title,
            String description,
            String cover,
            String media,
            String content,
            LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.description = description;
        this.cover = cover;
        this.media = media;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getTitle() {
        return title;
    }

    public String getCover() {
        return cover;
    }

    public String getContent() {
        return content;
    }

    public String getMedia() {
        return media;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getDescription() {
        return description;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public void setMedia(String media) {
        this.media = media;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Transient
    public Optional<String> isValidBlog() {
        if (this.title == null || this.title.length() < 30 || this.title.length() > 100) {
            return Optional.of("Invalid title");
        }
        if (this.description == null || this.description.length() < 100 || this.description.length() > 200) {
            return Optional.of("Invalid description");
        }
        if (this.content == null || this.content.length() < 300 || this.content.length() > 5_000) {
            return Optional.of("Invalid content");
        }
        return Optional.empty();
    }

}
