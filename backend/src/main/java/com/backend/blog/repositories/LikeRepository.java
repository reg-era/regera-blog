package com.backend.blog.repositories;

import com.backend.blog.entities.Like;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Long countByBlogId(Long blogId);

    Optional<Like> findByBlogIdAndUserId(Long blogId, Long AuthorId);

    boolean existsByBlogIdAndUserId(Long blogId, Long AuthorId);
}
