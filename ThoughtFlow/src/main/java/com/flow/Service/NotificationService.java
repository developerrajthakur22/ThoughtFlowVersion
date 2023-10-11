// NotificationService.java
package com.flow.Service;

import com.flow.Entity.Notification;
import com.flow.Entity.Post;
import com.flow.Entity.UserProfile;

import java.util.List;

public interface NotificationService {
    void createFollowNotification(UserProfile recipient, UserProfile sender);
    void createLikeNotification(UserProfile recipient, UserProfile sender, Post post);
    void createCommentNotification(UserProfile recipient, UserProfile sender, Post post);
    List<Notification> getNotificationsForUser(UserProfile recipient);
}

