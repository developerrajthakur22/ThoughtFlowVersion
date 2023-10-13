package com.flow.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flow.Entity.Notification;
import com.flow.Entity.Post;
import com.flow.Entity.UserProfile;
import com.flow.Service.NotificationService;
import com.flow.Service.UserService;

@RestController
public class NotificationController {

	@Autowired
	private NotificationService notificationService;
	
	@Autowired
	private UserService userService;
	
	@GetMapping("/getNotication/{userId}")
	public ResponseEntity<List<Notification>> getNotication(@PathVariable long userId){
		UserProfile user = userService.findUserById(userId);
		
		List<Notification> notificationList = notificationService.getNotificationsForUser(user);
		
		return new ResponseEntity<>(notificationList, HttpStatus.OK);
	}
	
	
	@PostMapping("/createFollowNoti/{recipent_id}/{sender_id}")
	public ResponseEntity<Void> createFollowingNotification(@PathVariable long recipent_id, @PathVariable long sender_id){
		UserProfile recipent = userService.findUserById(recipent_id);
		UserProfile sender = userService.findUserById(sender_id);
		
		notificationService.createFollowNotification(recipent, sender);
		
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}
	
	@PostMapping("/createLikeNoti/{recipent_id}/{sender_id}/{post_id}")
	public ResponseEntity<Void> createPostLikeNotification(@PathVariable long recipent_id, @PathVariable long sender_id, @PathVariable long post_id){
		UserProfile recipent = userService.findUserById(recipent_id);
		UserProfile sender = userService.findUserById(sender_id);
		Post post = userService.getPostById(post_id);
		
		notificationService.createLikeNotification(recipent, sender, post);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}
	
	@PostMapping("/createCommentNoti/{recipent_id}/{sender_id}/{post_id}")
	public ResponseEntity<Void> createCommentNotification(@PathVariable long recipent_id, @PathVariable long sender_id, @PathVariable long post_id){
		UserProfile recipent = userService.findUserById(recipent_id);
		UserProfile sender = userService.findUserById(sender_id);
		Post post = userService.getPostById(post_id);
		
		notificationService.createCommentNotification(recipent, sender, post);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}
	
}
