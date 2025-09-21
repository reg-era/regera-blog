package com.backend.blog.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.blog.dto.NotificationDto;
import com.backend.blog.entities.User;
import com.backend.blog.services.NotificationService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getLikes(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        List<NotificationDto> response = this.notificationService.getNotifications(user.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{notId}")
    public ResponseEntity<Map<String, String>> removeLikes(@PathVariable Long notId, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        this.notificationService.removeNotification(user.getId(), notId);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Notification removed");

        return ResponseEntity.ok(res);
    }
}
