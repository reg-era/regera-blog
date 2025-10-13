package com.backend.blog.dto;

import java.util.List;

public record SearchDto(List<UserDto> users, List<BlogDto> blogs) {

}
