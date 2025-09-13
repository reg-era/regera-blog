package com.backend.blog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.blog.entities.Blog;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    public Optional<Blog> findById(Long id);
    public List<Blog> findTop5ByOrderByCreatedAtDesc();
}
