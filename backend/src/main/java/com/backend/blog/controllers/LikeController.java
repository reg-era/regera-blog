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
import com.backend.blog.services.LikeService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @GetMapping("/{blogId}")
    public ResponseEntity<Map<String, Long>> getLikes(@PathVariable Long blogId) {
        Long likes = this.likeService.getLikesForBlog(blogId);
        return ResponseEntity.ok(Map.of("likes", likes));
    }

    @PostMapping("/{blogId}")
    public ResponseEntity<Map<String, Long>> toggleLike(@PathVariable Long blogId, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        boolean liked = this.likeService.toggleLike(blogId, user.getId());
        Long likes = this.likeService.getLikesForBlog(blogId);

        Map<String, Long> response = new HashMap<>();

        response.put("status", liked ? Long.valueOf(1) : Long.valueOf(0));
        response.put("likes", likes);

        return ResponseEntity.ok(response);
    }

}