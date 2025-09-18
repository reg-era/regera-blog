package com.backend.blog.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.blog.dto.BlogDto;
import com.backend.blog.entities.Blog;
import com.backend.blog.entities.User;
import com.backend.blog.services.BlogService;
import com.backend.blog.services.MediaService;
import com.backend.blog.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService blogService;
    private final MediaService mediaService;

    public BlogController(BlogService blogService, UserService userService, MediaService mediaService) {
        this.blogService = blogService;
        this.mediaService = mediaService;
    }

    @GetMapping
    public ResponseEntity<List<BlogDto>> getHomeBlog() {
        List<BlogDto> blogs = this.blogService.readLatestBlogs();
        return ResponseEntity.ok(blogs);
    }

    @GetMapping("/{blogId}")
    public ResponseEntity<BlogDto> readBlog(@PathVariable Long blogId, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        BlogDto blog = this.blogService.readBlog(Long.valueOf(blogId), user);
        return ResponseEntity.ok(blog);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> makeBlog(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String content,
            @RequestParam(required = false) MultipartFile media,
            HttpServletRequest request) throws IOException {

        User user = (User) request.getAttribute("user");

        Blog blog = new Blog();
        blog.setUser(user);
        blog.setTitle(title);
        blog.setDescription(description);
        blog.setContent(content);

        if (media == null || media.isEmpty()) {
            blog.setCover(this.mediaService.DEFAULT_BLOG);
            blog.setMedia(this.mediaService.DEFAULT_BLOG);
        } else {
            MediaService.InnerMediaService path = this.mediaService.downloadMedia(media);
            blog.setCover(path.cover());
            blog.setMedia(path.media());
        }

        Blog saved = this.blogService.createBlog(blog);

        Map<String, Object> res = new HashMap<>();
        res.put("id", saved.getId());
        res.put("message", "Blog created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/{blogId}")
    public ResponseEntity<Map<String, String>> updateBlog(@PathVariable String blogId, @RequestBody Blog blog) {
        return null;
    }

    @DeleteMapping("/{blogId}")
    public ResponseEntity<Map<String, String>> removeBlog(@PathVariable String blogId) {
        return null;
    }

}