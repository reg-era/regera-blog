package com.backend.blog.repositories;

import com.backend.blog.entities.Like;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
    long countByBlogId(Long blogId);

    Optional<Like> findByBlogIdAndUserId(Long blogId, Long AuthorId);
}
