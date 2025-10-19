package com.backend.blog.dto;

import java.util.List;

public record AdminDashboard(
        Long users,
        Long blogs,
        List<ReportDto> reports) {
}
