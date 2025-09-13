package com.backend.blog.dto;

import java.time.LocalDateTime;

public record BlogDto(Long id, String title, String content, String authorName, LocalDateTime createdAt) {
}