package com.backend.blog.services;

import com.backend.blog.dto.UserDto;
import com.backend.blog.entities.User;
import com.backend.blog.repositories.FollowRepository;
import com.backend.blog.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public UserService(UserRepository userRepository, FollowRepository followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }

    public User createUser(User user) {
        if (!user.isValidEmail())
            throw new IllegalArgumentException("Invalid Email");

        user.setPasswordHash(user.getPassword());
        user.setPicture("/media/images/default-profile.jpg");

        if (userRepository.existsByUsername(user.getUsername()))
            throw new IllegalArgumentException("Username already used");

        if (userRepository.existsByEmail(user.getEmail()))
            throw new IllegalArgumentException("Email already used");

        this.userRepository.save(user);
        return user;
    }

    public User fetchUser(String username) {
        Optional<User> user = this.userRepository.findByUsername(username);

        if (!user.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + username);

        return user.get();
    }

    public User fetchUser(String username, String email) {
        Optional<User> user = this.userRepository.findByUsername(username);
        if (!user.isPresent())
            user = this.userRepository.findByEmail(email);

        if (!user.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + username);
        }

        return user.get();
    }

    public boolean isFollowing(User user, Long otherId) {
        return this.followRepository.existsByUser_IdAndFollower_Id(user.getId(), otherId);
    }

    public List<UserDto> searchForUsers(String query) {
        List<User> users = this.userRepository.searchUsers(query);
        return users
                .stream()
                .map(user -> {
                    return new UserDto(
                            user.getUsername(),
                            user.getPicture(),
                            user.getEmail(),
                            user.getBio(),
                            user.getRole().toString(),
                            user.getCreatedAt(),
                            false,
                            0L);
                })
                .toList();
    }

}
