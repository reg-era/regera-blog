package com.backend.blog.services;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.blog.entities.Blog;
import com.backend.blog.entities.Like;
import com.backend.blog.entities.User;
import com.backend.blog.repositories.BlogRepository;
import com.backend.blog.repositories.LikeRepository;
import com.backend.blog.repositories.UserRepository;

@Service
public class LikeService {
    LikeRepository likeRepository;
    BlogRepository blogRepository;
    UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, BlogRepository blogRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    public Long getLikesForBlog(Long blogId) {
        if (!this.blogRepository.existsById(blogId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found");

        Long likes = this.likeRepository.countByBlogId(blogId);

        return likes;
    }

    public boolean toggleLike(Long blogId, Long userId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found"));

        User user = this.userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Optional<Like> existingLike = likeRepository.findByBlogIdAndAuthorId(blogId, userId);

        if (existingLike.isPresent()) {
            this.likeRepository.delete(existingLike.get());
            return false;
        } else {
            Like like = new Like();
            like.setBlog(blog);
            like.setAuthor(user);
            this.likeRepository.save(like);
            return true;
        }
    }
}
