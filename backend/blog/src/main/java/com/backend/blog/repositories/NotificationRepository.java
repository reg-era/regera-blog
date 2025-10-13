package com.backend.blog.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.blog.entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    public List<Notification> findAllByUserId(Long userId);

    boolean existsByIdAndUserId(Long notificationId, Long userId);
}
