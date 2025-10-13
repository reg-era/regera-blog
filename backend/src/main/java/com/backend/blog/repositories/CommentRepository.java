package com.backend.blog.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.blog.entities.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBlogId(Long blogId, Pageable pageable);

    Long countByBlogId(Long BlogId);
}
