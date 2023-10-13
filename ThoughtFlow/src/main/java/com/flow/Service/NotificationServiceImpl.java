// NotificationServiceImpl.java
package com.flow.Service;

import com.flow.Entity.Notification;
import com.flow.Entity.Post;
import com.flow.Entity.UserProfile;
import com.flow.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void createFollowNotification(UserProfile recipient, UserProfile sender) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setType("Follow");
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    public void createLikeNotification(UserProfile recipient, UserProfile sender, Post post) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setType("Like");
        notification.setPost(post);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    public void createCommentNotification(UserProfile recipient, UserProfile sender, Post post) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setType("Comment");
        notification.setPost(post);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsForUser(UserProfile recipient) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient);
    }
    
}
