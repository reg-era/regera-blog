package com.backend.blog.dto;

import java.time.LocalDateTime;

public record CommentDto(
        Long id,
        String author,
        Long blog,
        String content,
        LocalDateTime createdAt) {
}
