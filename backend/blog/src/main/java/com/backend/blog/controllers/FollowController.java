package com.backend.blog.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.blog.entities.User;
import com.backend.blog.services.FollowService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Long>> getFollows(@PathVariable Long userId) {
        Long follows = this.followService.countFollowing(userId);
        return ResponseEntity.ok(Map.of("follows", follows));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Map<String, Long>> toggleFollow(@PathVariable Long userId, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        boolean isFollowing = this.followService.toggleFollow(user.getId(), userId);
        Long follows = this.followService.countFollowing(userId);

        Map<String, Long> response = new HashMap<>();

        response.put("status", isFollowing ? Long.valueOf(1) : Long.valueOf(0));
        response.put("follows", follows);

        return ResponseEntity.ok(response);
    }

}