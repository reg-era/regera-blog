package com.backend.blog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.blog.entities.Blog;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    Optional<Blog> findById(Long id);

    List<Blog> findTop5ByOrderByCreatedAtDesc();

    List<Blog> findByUserUsername(String username);

    @Query("SELECT b FROM Blog b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.content) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Blog> searchBlogs(@Param("query") String query);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN TRUE ELSE FALSE END FROM Blog b " +
            "WHERE b.id = :blog_id AND b.user.id = :user_id")
    Boolean ownerOfBlog(@Param("blog_id") Long blogId, @Param("user_id") Long userId);

}
