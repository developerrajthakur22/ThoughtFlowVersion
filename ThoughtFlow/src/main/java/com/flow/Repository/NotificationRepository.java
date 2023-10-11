package com.flow.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.flow.Entity.Notification;
import com.flow.Entity.UserProfile;

import jakarta.transaction.Transactional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByRecipientOrderByCreatedAtDesc(UserProfile recipient);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.post.id = :postId")
    void deleteNotificationsByPostId(Long postId);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.recipient.id = :recipientId")
    void deleteNotificationsByRecipientId(Long recipientId);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.sender.id = :senderId")
    void deleteNotificationsBySenderId(Long senderId);

}
