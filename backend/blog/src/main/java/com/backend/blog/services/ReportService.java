package com.backend.blog.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.blog.entities.Report;
import com.backend.blog.entities.User;
import com.backend.blog.repositories.BlogRepository;
import com.backend.blog.repositories.ReportRepository;
import com.backend.blog.repositories.UserRepository;

@Service
public class ReportService {
        ReportRepository reportRepository;
        BlogRepository blogRepository;
        UserRepository userRepository;

        public ReportService(ReportRepository reportRepository,
                        BlogRepository blogRepository,
                        UserRepository userRepository) {
                this.blogRepository = blogRepository;
                this.userRepository = userRepository;
                this.reportRepository = reportRepository;
        }

        public void makeReport(Long userId, Report report) {
                User reporter = userRepository.findById(userId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Reporter not found"));

                User reportedUser = userRepository.findById(report.getReportedUser().getId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
                report.setReportedUser(reportedUser);

                report.setUser(reporter);

                reportRepository.save(report);
        }

}
