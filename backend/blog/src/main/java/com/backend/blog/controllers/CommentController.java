package com.backend.blog.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @GetMapping("/{id}")
    public ResponseEntity<List<String>> readComments(@PathVariable String blogId) {
        return null;
    }

    @PreAuthorize("hasRole('BLOGGER')")
    @PostMapping("/{id}")
    public ResponseEntity<Map<String, String>> makecomment(@PathVariable String blogId, @RequestBody String comment) {
        return null;
    }

}