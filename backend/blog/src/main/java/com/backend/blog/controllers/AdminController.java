package com.backend.blog.controllers;

import java.util.HashMap;
import java.util.Map;

import com.backend.blog.services.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/users/{username}")
    public ResponseEntity<Map<String, String>> escaleAdmin(@PathVariable String username) {
        this.adminService.escaleIntoAdmin(username);
        Map<String, String> res = new HashMap<>();
        res.put("message", "admin escaled");
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @DeleteMapping("/users/{username}")
    public ResponseEntity<Map<String, String>> removeUser(@PathVariable String username) {
        this.adminService.removeUser(username);
        Map<String, String> res = new HashMap<>();
        res.put("message", "user removed");
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @DeleteMapping("/blog/{blogId}")
    public ResponseEntity<Map<String, String>> removeBlog(@PathVariable Long blogId) {
        this.adminService.removeBlog(blogId);
        Map<String, String> res = new HashMap<>();
        res.put("message", "blog removed");
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

}