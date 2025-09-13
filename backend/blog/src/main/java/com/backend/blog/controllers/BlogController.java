package com.backend.blog.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.blog.entities.Blog;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @GetMapping("/home")
    public ResponseEntity<List<Blog>> getHomeBlog(@PathVariable String blogId) {
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> readBlog(@PathVariable String blogId) {
        return null;
    }

    @PreAuthorize("hasRole('BLOGGER')")
    @PostMapping("/{id}")
    public ResponseEntity<Map<String, String>> makeBlog(@RequestBody Blog blog) {
        return null;
    }

    @PreAuthorize("hasRole('BLOGGER')")
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateBlog(@PathVariable String blogId, @RequestBody Blog blog) {
        return null;
    }

    @PreAuthorize("hasRole('BLOGGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> removeBlog(@PathVariable String blogId) {
        return null;
    }

}