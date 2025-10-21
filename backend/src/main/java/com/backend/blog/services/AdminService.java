package com.backend.blog.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.blog.dto.AdminDashboard;
import com.backend.blog.dto.ReportDto;
import com.backend.blog.entities.Blog;
import com.backend.blog.entities.Report;
import com.backend.blog.entities.User;
import com.backend.blog.repositories.BlogRepository;
import com.backend.blog.repositories.ReportRepository;
import com.backend.blog.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class AdminService {

    private final MediaService mediaService;

    private final ReportRepository reportRepository;

    private final BlogRepository blogRepository;

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository, BlogRepository blogRepository,
            ReportRepository reportRepository, MediaService mediaService) {
        this.userRepository = userRepository;
        this.blogRepository = blogRepository;
        this.reportRepository = reportRepository;
        this.mediaService = mediaService;
    }

    public AdminDashboard readRepports() {
        Long users = this.userRepository.count();
        Long blogs = this.blogRepository.count();
        List<ReportDto> res = this.reportRepository.findAll().stream()
                .map(rep -> new ReportDto(rep.getId(),
                        rep.getUser().getUsername(),
                        rep.getReportedUser().getUsername(),
                        rep.getContent(),
                        rep.getCreatedAt()))
                .toList();

        return new AdminDashboard(users, blogs, res);
    }

    public void removeRepport(Long reportId) {
        Optional<Report> report = this.reportRepository.findById(reportId);

        if (!report.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found");

        this.reportRepository.delete(report.get());
    }

    @Transactional
    public void escaleIntoAdmin(String username) {
        Optional<User> user = this.userRepository.findByUsername(username);
        if (user.isPresent()) {
            if (!user.get().getRole().equals(User.Role.ADMIN)) {
                User newAdmin = user.get();
                newAdmin.setRole(User.Role.ADMIN);
                this.userRepository.save(newAdmin);
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    public void removeUser(String username) {
        Optional<User> user = this.userRepository.findByUsername(username);
        if (user.isPresent()) {
            this.userRepository.delete(user.get());
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    public void removeBlog(Long blogId) {
        Optional<Blog> blog = this.blogRepository.findById(blogId);
        if (blog.isPresent()) {
            this.blogRepository.delete(blog.get());

            if (blog.get().getCover().equals(blog.get().getMedia())) {
                this.mediaService.clearMedia(blog.get().getMedia());
            } else {
                this.mediaService.clearMedia(blog.get().getCover());
                this.mediaService.clearMedia(blog.get().getMedia());
            }

        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Blog not found");
        }

    }
}
