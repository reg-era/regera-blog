package com.backend.blog.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.backend.blog.entities.User;
import com.backend.blog.services.BlogService;
import com.backend.blog.services.CommentService;
import com.backend.blog.services.UserService;
import com.backend.blog.dto.CommentDto;
import com.backend.blog.entities.Comment;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;
    private final BlogService blogService;
    private final UserService userService;

    public CommentController(CommentService commentService, BlogService blogService, UserService userService) {
        this.commentService = commentService;
        this.blogService = blogService;
        this.userService = userService;
    }

    @GetMapping("/{blogId}")
    public ResponseEntity<List<CommentDto>> readComments(
            @PathVariable Long blogId,
            @RequestParam(defaultValue = "0") int offset) {

        List<CommentDto> comments = commentService.readComments(blogId, offset);
        return ResponseEntity.ok(comments);
    }

    @PreAuthorize("hasRole('BLOGGER')")
    @PostMapping("/{blogId}")
    public ResponseEntity<Map<String, String>> makeComment(@PathVariable Long blogId, @RequestBody String content) {
        if (this.blogService.existBlog(blogId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User author = this.userService.fetchUser(username);

        Comment comment = new Comment();
        comment.setAuthor(author);
        comment.setBlog(this.blogService.readBlog(blogId));
        comment.setContent(content.trim());

        this.commentService.createComment(comment);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Comment added successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

}