package com.backend.blog.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.backend.blog.services.UserService;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService blogService;
    private final UserService userService;

    public BlogController(BlogService blogService, UserService userService) {
        this.blogService = blogService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<BlogDto>> getHomeBlog() {
        List<BlogDto> blogs = this.blogService.readLatestBlogs();
        return ResponseEntity.ok(blogs);
    }

    @GetMapping("/{blogId}")
    public ResponseEntity<BlogDto> readBlog(@PathVariable Long blogId) {
        Blog blog = this.blogService.readBlog(Long.valueOf(blogId));

        BlogDto dto = new BlogDto(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getUser().getUsername(),
                blog.getCreatedAt());

        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> makeBlog(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "cover", required = false) MultipartFile coverFile) throws IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String user = auth.getPrincipal().toString();
        User author = this.userService.fetchUser(user);

        Blog blog = new Blog();
        blog.setUser(author);
        blog.setTitle(title);
        blog.setContent(content);

        if (coverFile != null && !coverFile.isEmpty()) {
            String fileName = Blog.saveFile(coverFile);
            blog.setCover(fileName);
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