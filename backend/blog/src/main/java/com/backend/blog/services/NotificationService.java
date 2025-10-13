package com.backend.blog.services;

import com.backend.blog.dto.NotificationDto;
import com.backend.blog.entities.Notification;
import com.backend.blog.repositories.NotificationRepository;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationDto> getNotifications(Long id) {
        List<Notification> notifs = this.notificationRepository.findAllByUserId(id);
        return notifs.stream().map(not -> new NotificationDto(
                not.getId(),
                id, not.getContent(),
                not.getCreatedAt())).toList();
    }

    public void removeNotification(Long userID, Long notId) {
        if (!this.notificationRepository.existsByIdAndUserId(notId, userID)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Notification not found or not owned by user");
        }

        this.notificationRepository.deleteById(notId);
    }
}
