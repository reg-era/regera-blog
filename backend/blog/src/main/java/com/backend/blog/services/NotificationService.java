package com.backend.blog.services;

import com.backend.blog.dto.NotificationDto;
import com.backend.blog.entities.Notification;
import com.backend.blog.repositories.NotificationRepository;

import java.util.List;
import java.util.Optional;

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
        Optional<Notification> not = this.notificationRepository.findById(notId);
        if (not.isPresent()) {
            Notification notification = not.get();
            if (notification.getUser().getId() == userID) {
                this.notificationRepository.delete(notification);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trying to deletr a non owned notification");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found");
        }
    }
}
