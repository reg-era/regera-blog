package com.backend.blog.controllers;

import com.backend.blog.entities.User;
import com.backend.blog.services.UserService;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody User registerReq) {
        Map<String, String> res = new HashMap<String, String>();

        if (registerReq.getUsername().equals("existingUser")) {
            res.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(res);
        }

        return ResponseEntity.ok(res);
    }

    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> getMethodName(@Valid @RequestBody User loginReq) {
        Map<String, String> res = new HashMap<String, String>();
        String jwtToken = "oxygen";

        loginReq.getUsername();

        res.put("token", jwtToken);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{username}")
    public User getByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
