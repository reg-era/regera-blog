package com.backend.blog.entities;

import jakarta.persistence.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

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

    @Column(nullable = true)
    private String cover;

    @Column(nullable = false)
    private String content;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
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

    @Transient
    public boolean isValidBlog() {
        return title != null && !title.isEmpty()
                && content != null && !content.isEmpty();
    }

    public static String saveFile(MultipartFile file) throws IOException {
        String uploadsDir = "/uploads/";
        String originalFilename = file.getOriginalFilename();
        Path path = Paths.get(uploadsDir + originalFilename);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        return originalFilename; // or full path/URL
    }

    @Override
    public String toString() {
        return this.id + " " + this.title + " " + this.content;
    }

}
