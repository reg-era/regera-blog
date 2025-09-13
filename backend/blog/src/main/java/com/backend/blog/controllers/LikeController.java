package com.backend.blog.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

public class LikeController {

    @GetMapping("/{id}")
    public ResponseEntity<List<String>> getLiks(@PathVariable String blogId) {
        return null;
    }

    @PreAuthorize("hasRole('BLOGGER')")
    @PostMapping("/{id}")
    public ResponseEntity<Map<String, String>> toggleLike(@PathVariable String blogId) {
        return null;
    }

}