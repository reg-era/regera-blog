package com.backend.blog.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.blog.entities.Report;
import com.backend.blog.entities.User;
import com.backend.blog.services.ReportService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> postMethodName(@Valid @RequestBody Report report,
            HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        this.reportService.makeReport(user.getId(), report);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Thanks for reporting");
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
}
