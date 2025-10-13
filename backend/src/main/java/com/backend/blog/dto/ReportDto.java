package com.backend.blog.dto;

import java.time.LocalDateTime;

public record ReportDto(
                Long reportId,
                String reporter,
                String reported,
                String content,
                LocalDateTime createAt) {
}
