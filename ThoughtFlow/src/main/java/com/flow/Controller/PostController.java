package com.flow.Controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.flow.Entity.Comment;
import com.flow.Entity.Post;
import com.flow.Exceptions.NotFoundException;
import com.flow.Exceptions.SomethingWentWrong;
import com.flow.Repository.PostRepository;
import com.flow.Service.UserService;

@RestController
public class PostController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private PostRepository postRepo;
	
	@GetMapping("/Feed/{user_id}")
	public ResponseEntity<Set<Post>> feed(@PathVariable long user_id) throws NotFoundException{
		Set<Post> feedPosts = userService.userFeed(user_id);
		return new ResponseEntity<>(feedPosts, HttpStatus.OK);
	}
	
	@PostMapping("/LikePost/{post_id}/{user_id}")
	public ResponseEntity<Void> likeAPost(@PathVariable long post_id, @PathVariable long user_id){
		userService.userPostLike(post_id, user_id);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}
	
	@DeleteMapping("/UnlikePost/{post_id}/{user_id}")
	public ResponseEntity<Void> unlikeThePost(@PathVariable long post_id, @PathVariable long user_id){
		userService.postUnlike(post_id, user_id);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}
	
	@PostMapping("/CommentPost/{post_id}/{user_id}/{comment}")
	public ResponseEntity<Void> postAComment(@PathVariable long post_id, @PathVariable long user_id, @PathVariable String comment){
		userService.userPostComment(post_id, user_id, comment);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/allPosts")
	public ResponseEntity<List<Post>> allPost(){
		List<Post> posts = postRepo.findAll();
		Collections.reverse(posts);
		return new ResponseEntity<>(posts,HttpStatus.OK);
	}
	
	@GetMapping("/PostComments/{post_id}")
	public ResponseEntity<List<Map<String, Comment>>> postComments(@PathVariable long post_id) throws SomethingWentWrong{
		return new ResponseEntity<>(userService.getPostComment(post_id), HttpStatus.OK);
	}
	
	//Get user posts
	@GetMapping("/UserPosts/{id}")
	public ResponseEntity<List<Post>> getUserPost(@PathVariable long id){
		List<Post> post = userService.getUserPost(id);
		return new ResponseEntity<>(post,HttpStatus.OK);
	}
	
	//Search Post
	@GetMapping("/SearchPost/{keyword}")
	public ResponseEntity<List<Post>> getSearchPost(@PathVariable String keyword){
		List<Post> post = userService.searchPost(keyword);
		return new ResponseEntity<>(post, HttpStatus.OK);
	}
	
	//like a comment
	@PostMapping("/likeAComment/{post_id}")
	public ResponseEntity<Void> likeAComment(@PathVariable long post_id, @RequestBody Comment comment){
		 userService.userCommentLike(post_id, comment);
		 return new ResponseEntity<Void>(HttpStatus.OK);
	}
	
	//Comment delete
	@DeleteMapping("/deleteAComment/{post_id}")
	public ResponseEntity<Void> deleteAComment(@PathVariable long post_id, @RequestBody Comment comment){
		userService.userDeleteComment(comment, post_id);
		return new ResponseEntity<Void>(HttpStatus.ACCEPTED);
	}
}
