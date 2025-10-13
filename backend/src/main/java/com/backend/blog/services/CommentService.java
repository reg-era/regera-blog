package com.backend.blog.services;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.blog.dto.CommentDto;
import com.backend.blog.entities.Comment;
import com.backend.blog.repositories.CommentRepository;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<CommentDto> readComments(Long blogId, int offset) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(offset, 5, sort);

        List<CommentDto> res = commentRepository.findByBlogId(blogId, pageable).stream()
                .map(comm -> new CommentDto(comm.getId(),
                        comm.getUser().getUsername(),
                        comm.getBlog().getId(),
                        comm.getContent(),
                        comm.getCreatedAt()))
                .toList();

        return res;
    }

    public CommentDto createComment(Comment comment) {
        if (!comment.isValidComment()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid comment information");
        }
        Comment newComment = this.commentRepository.save(comment);
        return new CommentDto(newComment.getId(),
                newComment.getUser().getUsername(),
                newComment.getBlog().getId(),
                newComment.getContent(),
                newComment.getCreatedAt());
    }

}
