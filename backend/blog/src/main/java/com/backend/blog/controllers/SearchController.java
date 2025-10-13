package com.backend.blog.controllers;

import com.backend.blog.dto.BlogDto;
import com.backend.blog.dto.SearchDto;
import com.backend.blog.dto.UserDto;
import com.backend.blog.services.BlogService;
import com.backend.blog.services.UserService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final UserService userService;
    private final BlogService blogService;

    public SearchController(BlogService blogService, UserService userService) {
        this.blogService = blogService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<SearchDto> performSearch(@RequestBody String query) {
        if (query.length() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Query must be bigger");
        }
        List<UserDto> users = this.userService.searchForUsers(query);
        List<BlogDto> blogs = this.blogService.searchForBlogs(query);
        return ResponseEntity.ok(new SearchDto(users, blogs));
    }
}
