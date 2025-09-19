package com.backend.blog.controllers;

import com.backend.blog.dto.BlogDto;
import com.backend.blog.dto.UserDto;
import com.backend.blog.entities.User;
import com.backend.blog.services.BlogService;
import com.backend.blog.services.FollowService;
import com.backend.blog.services.UserService;
import com.backend.blog.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final BlogService blogService;
    private final FollowService followService;

    public class UserInfoResponce {
        public UserDto profile;
        public List<BlogDto> blogs;

        public UserInfoResponce(UserDto profile, List<BlogDto> blogs) {
            this.profile = profile;
            this.blogs = blogs;
        }
    }

    public UserController(UserService userService, BlogService blogService, FollowService followService) {
        this.userService = userService;
        this.blogService = blogService;
        this.followService = followService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody User registerReq) {
        User created = this.userService.createUser(registerReq);

        String token = JwtUtil.generateToken(created.getId(), created.getUsername(), created.getRole().name());

        Map<String, String> res = new HashMap<>();
        res.put("token", token);
        res.put("username", created.getUsername());
        res.put("role", created.getRole().name());

        return ResponseEntity.ok(res);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> getMethodName(@Valid @RequestBody User loginReq) {
        Map<String, String> res = new HashMap<String, String>();

        User user = this.userService.fetchUser(loginReq.getUsername(), loginReq.getEmail());

        if (!user.getPasswordHash().equals(loginReq.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");

        String token = JwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole().name());

        res.put("token", token);
        res.put("username", user.getUsername());
        res.put("role", user.getRole().name());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> pingUser(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        Map<String, String> res = new HashMap<String, String>();
        res.put("username", user.getUsername());
        res.put("role", user.getRole().name());

        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<UserInfoResponce> getBySelf(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        User userInfo = this.userService.fetchUser(user.getUsername());

        List<BlogDto> blogs = this.blogService.readUserBlogs(userInfo.getUsername());
        Long followers = this.followService.countFollowing(userInfo.getUsername());
        UserDto profile = userInfo.toDto(false, followers);

        return ResponseEntity.ok(new UserInfoResponce(profile, blogs));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserInfoResponce> getByUsername(@PathVariable String username, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        User other = this.userService.fetchUser(username);
        boolean isFollowing = user != null ? this.userService.isFollowing(user, other.getId()) : false;

        List<BlogDto> blogs = this.blogService.readUserBlogs(other.getUsername());
        Long follwers = this.followService.countFollowing(other.getUsername());
        UserDto profile = other.toDto(isFollowing, follwers);

        return ResponseEntity.ok(new UserInfoResponce(profile, blogs));
    }

}
