package com.backend.blog.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.blog.dto.BlogDto;
import com.backend.blog.entities.Blog;
import com.backend.blog.entities.User;
import com.backend.blog.repositories.BlogRepository;
import com.backend.blog.repositories.CommentRepository;
import com.backend.blog.repositories.LikeRepository;

@Service
public class BlogService {
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    public BlogService(BlogRepository blogRepository, CommentRepository commentRepository,
            LikeRepository likeRepository) {
        this.blogRepository = blogRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
    }

    public final List<BlogDto> readLatestBlogs() {
        return this.blogRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(blog -> {
                    Long comments = this.commentRepository.countByBlogId(blog.getId());
                    Long like = this.likeRepository.countByBlogId(blog.getId());
                    return new BlogDto(
                            blog.getId(),
                            blog.getTitle(),
                            blog.getContent(),
                            blog.getDescription(),
                            blog.getUser().getUsername(),
                            blog.getCover(), blog.getMedia(),
                            like, comments, false,
                            blog.getCreatedAt());
                })
                .toList();
    }

    public final List<BlogDto> readUserBlogs(String username) {
        return this.blogRepository.findByUserUsername(username)
                .stream()
                .map(blog -> {
                    Long comments = this.commentRepository.countByBlogId(blog.getId());
                    Long like = this.likeRepository.countByBlogId(blog.getId());
                    return new BlogDto(
                            blog.getId(),
                            blog.getTitle(),
                            blog.getContent(),
                            blog.getDescription(),
                            blog.getUser().getUsername(),
                            blog.getCover(), blog.getMedia(),
                            like, comments, false,
                            blog.getCreatedAt());
                })
                .toList();
    }

    public BlogDto readBlog(Long blogId, User user) {
        Optional<Blog> blog = this.blogRepository.findById(blogId);

        if (!blog.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found");

        Long comments = this.commentRepository.countByBlogId(blog.get().getId());
        Long like = this.likeRepository.countByBlogId(blog.get().getId());
        boolean isLiking = (user != null) ? this.likeRepository.existsByBlogIdAndUserId(blogId, user.getId()) : false;

        return new BlogDto(
                blog.get().getId(),
                blog.get().getTitle(),
                blog.get().getContent(),
                blog.get().getDescription(),
                blog.get().getUser().getUsername(),
                blog.get().getCover(), blog.get().getMedia(),
                like, comments, isLiking,
                blog.get().getCreatedAt());
    }

    public Blog createBlog(Blog blog) {
        if (!blog.isValidBlog()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid blog information");
        }

        return this.blogRepository.save(blog);
    }

    public void updateBlog(Blog blog) {
    }

    public boolean existBlog(Long blogId) {
        return this.blogRepository.existsById(blogId);
    }

    public List<BlogDto> searchForBlogs(String query) {
        return this.blogRepository.searchBlogs(query)
                .stream()
                .map(blog -> {
                    Long comments = this.commentRepository.countByBlogId(blog.getId());
                    Long like = this.likeRepository.countByBlogId(blog.getId());
                    return new BlogDto(
                            blog.getId(),
                            blog.getTitle(),
                            blog.getContent(),
                            blog.getDescription(),
                            blog.getUser().getUsername(),
                            blog.getCover(), blog.getMedia(),
                            like, comments, false,
                            blog.getCreatedAt());
                })
                .toList();
    }

}
