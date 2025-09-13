package com.backend.blog.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{username}")
    public ResponseEntity<Map<String, String>> escaleAdmin(@PathVariable String username) {
        return null;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{username}")
    public ResponseEntity<Map<String, String>> removeUser(@PathVariable String username) {
        return null;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/blog/{username}")
    public ResponseEntity<Map<String, String>> removeBlog(@PathVariable String id) {
        return null;
    }

}