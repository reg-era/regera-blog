package com.backend.blog.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.blog.entities.Report;
import com.backend.blog.entities.User;
import com.backend.blog.services.ReportService;
import com.backend.blog.services.UserService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final UserService userService;

    ReportService reportService;

    public ReportController(ReportService reportService, UserService userService) {
        this.reportService = reportService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> postMethodName(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {


        String reportedUsername = (String) payload.get("reported");
        String content = (String) payload.get("content");

        User reporter = (User) request.getAttribute("user");
        User reported = this.userService.fetchUser(reportedUsername);
        Report report = new Report();

        report.setUser(reporter);
        report.setReportedUser(reported);
        report.setContent(content);

        this.reportService.makeReport(reporter.getId(), report);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Thanks for reporting");
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
}
