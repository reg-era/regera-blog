package com.backend.blog.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import jakarta.servlet.http.HttpServletRequest;

import com.backend.blog.dto.CommentDto;
import com.backend.blog.entities.Comment;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;
    private final BlogService blogService;

    public CommentController(CommentService commentService, BlogService blogService) {
        this.commentService = commentService;
        this.blogService = blogService;
    }

    @GetMapping("/{blogId}")
    public ResponseEntity<List<CommentDto>> readComments(
            @PathVariable Long blogId,
            @RequestParam(defaultValue = "0") int offset) {

        List<CommentDto> comments = commentService.readComments(blogId, offset);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{blogId}")
    public ResponseEntity<CommentDto> makeComment(@PathVariable Long blogId, @RequestBody String content,
            HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        if (!this.blogService.existBlog(blogId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found");

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setBlog(this.blogService.readBlog(blogId, user).toBlog(user));
        comment.setContent(content.trim());

        CommentDto res = this.commentService.createComment(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

}