package com.backend.blog.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.backend.blog.dto.ReportDto;
import com.backend.blog.entities.User;
import com.backend.blog.services.AdminService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportDto>> getRepports() {
        List<ReportDto> reports = this.adminService.readRepports();
        return ResponseEntity.ok(reports);
    }

    @DeleteMapping("/reports/{reportId}")
    public ResponseEntity<Map<String, String>> removeRepport(@PathVariable Long reportId) {
        this.adminService.removeRepport(reportId);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Report removed");
        return ResponseEntity.ok(res);
    }

    @PutMapping("/users/{username}")
    public ResponseEntity<Map<String, String>> escaleAdmin(@PathVariable String username, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        Map<String, String> res = new HashMap<>();
        if (user.getUsername().equals(username)) {
            res.put("message", "admin escaled");
        } else {
            this.adminService.escaleIntoAdmin(username);
            res.put("message", "admin escaled");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @DeleteMapping("/users/{username}")
    public ResponseEntity<Map<String, String>> removeUser(@PathVariable String username, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        Map<String, String> res = new HashMap<>();
        if (user.getUsername().equals(username)) {
            res.put("message", "Forbiden to remove your self");
        } else {
            this.adminService.removeUser(username);
            res.put("message", "user removed");
        }
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