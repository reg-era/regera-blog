package com.backend.blog.services;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.blog.entities.Blog;
import com.backend.blog.entities.User;
import com.backend.blog.repositories.BlogRepository;
import com.backend.blog.repositories.UserRepository;

@Service
public class AdminService {

    private final BlogRepository blogRepository;

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository, BlogRepository blogRepository) {
        this.userRepository = userRepository;
        this.blogRepository = blogRepository;
    }

    public void escaleIntoAdmin(String username) {
        Optional<User> user = this.userRepository.findByUsername(username);
        if (user.isPresent()) {
            User newAdmin = user.get();
            newAdmin.setRole(User.Role.ADMIN);
            this.userRepository.save(newAdmin);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    public void removeUser(String username) {
        Optional<User> user = this.userRepository.findByUsername(username);
        if (user.isPresent()) {
            this.userRepository.delete(user.get());
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    public void removeBlog(Long blogId) {
        Optional<Blog> blog = this.blogRepository.findById(blogId);
        if (blog.isPresent()) {
            this.blogRepository.delete(blog.get());
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found");
        }
    }
}
