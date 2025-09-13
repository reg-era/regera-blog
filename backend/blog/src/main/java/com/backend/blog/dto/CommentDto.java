package com.backend.blog.dto;

import java.time.LocalDateTime;

import com.backend.blog.entities.Blog;
import com.backend.blog.entities.User;

public record CommentDto(
        Long id,
        User author,
        Blog blog,
        String content,
        LocalDateTime createdAt) {
}
