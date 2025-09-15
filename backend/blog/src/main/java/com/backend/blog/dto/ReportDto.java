package com.backend.blog.dto;

import java.time.LocalDateTime;

public record ReportDto(
        Long reportId,
        Long userId,
        String username,
        boolean isuserReport,
        Long targetId,
        String content,
        LocalDateTime createAt) {
}
