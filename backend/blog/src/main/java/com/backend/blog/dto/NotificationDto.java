package com.backend.blog.dto;

import java.time.LocalDateTime;

public record NotificationDto(
        Long id,
        Long user_id,
        String content,
        LocalDateTime createdAt) {

}
