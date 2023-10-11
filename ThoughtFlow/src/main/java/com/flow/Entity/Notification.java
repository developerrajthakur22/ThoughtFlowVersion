package com.flow.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private UserProfile recipient;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private UserProfile sender;

    private String type; // Follow, Like, Comment

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post; // The related post (for Like and Comment notifications)

    private LocalDateTime createdAt;
    
	public Notification() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserProfile getRecipient() {
		return recipient;
	}

	public void setRecipient(UserProfile recipient) {
		this.recipient = recipient;
	}

	public UserProfile getSender() {
		return sender;
	}

	public void setSender(UserProfile sender) {
		this.sender = sender;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Post getPost() {
		return post;
	}

	public void setPost(Post post) {
		this.post = post;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}
    
}
