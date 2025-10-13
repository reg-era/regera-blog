package com.backend.blog.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.blog.entities.Follow;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByUser_IdAndFollower_Id(Long userId, Long followerId);

    boolean existsByUser_IdAndFollower_Id(Long userId, Long followerId);

    long countByFollowerId(Long followerId);

    long countByFollowerUsername(String followerName);
}