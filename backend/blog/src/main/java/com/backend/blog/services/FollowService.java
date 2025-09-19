package com.backend.blog.services;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.blog.entities.Follow;
import com.backend.blog.entities.User;
import com.backend.blog.repositories.FollowRepository;
import com.backend.blog.repositories.UserRepository;

@Service
public class FollowService {
    FollowRepository followRepository;
    UserRepository userRepository;

    public FollowService(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    public boolean toggleFollow(Long authorId, String followerName) {
        User follower = this.userRepository.findByUsername(followerName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Follower not found"));

        if (authorId.equals(follower.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User cannot follow themselves");
        }

        User author = this.userRepository.findById(authorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found"));

        Optional<Follow> existingFollow = this.followRepository.findByUser_IdAndFollower_Id(authorId, follower.getId());

        if (existingFollow.isPresent()) {
            this.followRepository.delete(existingFollow.get());
            return false;
        } else {
            Follow follow = new Follow();
            follow.setUserId(author);
            follow.setFollower(follower);
            this.followRepository.save(follow);
            return true;
        }
    }

    public Long countFollowing(String username) {
        return this.followRepository.countByFollowerUsername(username);
    }

    public boolean isFollowing(Long authorId, Long followerId) {
        if (authorId.equals(followerId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User cannot follow themselves");

        if (!this.userRepository.existsById(authorId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Author not found");

        if (!this.userRepository.existsById(followerId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Follower not found");

        return this.followRepository.existsByUser_IdAndFollower_Id(authorId, followerId);
    }
}
