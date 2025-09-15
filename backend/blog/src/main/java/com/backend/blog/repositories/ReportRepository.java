package com.backend.blog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.blog.entities.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
}
