package com.backend.blog.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    @GetMapping("/{userId}")
    public ResponseEntity<List<String>> getFollows(@PathVariable String userId) {
        return null;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Map<String, String>> toggleFollow(@PathVariable String userId) {
        return null;
    }

}