package com.backend.blog.dto;

import java.time.LocalDateTime;

public record UserDto(
                String username,
                String email,
                String bio,
                String role,
                LocalDateTime createdAt,
                boolean isFollowing,
                Long followers) {
}
