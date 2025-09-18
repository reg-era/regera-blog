package com.backend.blog.dto;

import java.time.LocalDateTime;

import com.backend.blog.entities.Blog;
import com.backend.blog.entities.User;

public record BlogDto(
                Long id,
                String title,
                String content,
                String description,
                String authorName,
                String cover,
                String media,
                Long likes,
                Long comments,
                boolean isLiking,
                LocalDateTime createdAt) {

        public Blog toBlog(User user) {
                return new Blog(id, user, title, description, cover, media, content, createdAt);
        }
}