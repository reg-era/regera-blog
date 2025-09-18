package com.backend.blog.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.blog.dto.BlogDto;
import com.backend.blog.entities.Blog;
import com.backend.blog.repositories.BlogRepository;

@Service
public class BlogService {
    private final BlogRepository blogRepository;

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public final List<BlogDto> readLatestBlogs() {
        return this.blogRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(blog -> new BlogDto(
                        blog.getId(),
                        blog.getTitle(),
                        blog.getContent(),
                        blog.getUser().getUsername(),
                        blog.getCreatedAt()))
                .toList();
    }

    public Blog readBlog(Long blogId) {
        Optional<Blog> blog = this.blogRepository.findById(blogId);

        if (!blog.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found");

        return blog.get();
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

}
