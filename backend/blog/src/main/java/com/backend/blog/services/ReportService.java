package com.backend.blog.services;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.blog.dto.ReportDto;
import com.backend.blog.entities.Blog;
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reporter not found"));

        if (report.getIsUserReport()) {
            User reportedUser = userRepository.findById(report.getTargetId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            report.setReportedUser(reportedUser);
        } else {
            Blog reportedBlog = blogRepository.findById(report.getTargetId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found"));
            report.setReportedBlog(reportedBlog);
        }

        report.setUser(reporter);

        reportRepository.save(report);
    }

    public List<ReportDto> readComments(int offset) {
        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(offset, 5, sort);

        List<ReportDto> res = this.reportRepository.findAll(pageable).stream()
                .map(rep -> new ReportDto(rep.getId(),
                        rep.getUser().getId(),
                        rep.getUser().getUsername(),
                        rep.getIsUserReport(),
                        rep.getTargetId(),
                        rep.getContent(),
                        rep.getCreatedAt()))
                .toList();

        return res;
    }

}
