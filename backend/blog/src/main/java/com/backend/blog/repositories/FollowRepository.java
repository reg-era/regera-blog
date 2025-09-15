package com.backend.blog.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.blog.entities.Follow;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByAuthorIdAndFollowerId(Long authorId, Long followerId);

    boolean existsByAuthorIdAndFollowerId(Long authorId, Long followerId);

    long countByFollowerId(Long followerId);
}