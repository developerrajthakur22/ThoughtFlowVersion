package com.flow.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.flow.Entity.Comment;
import com.flow.Entity.Post;
import com.flow.Entity.UserProfile;
import com.flow.Exceptions.NotFoundException;
import com.flow.Exceptions.SomethingWentWrong;

public interface UserService {

	public UserProfile createUser(UserProfile user) throws SomethingWentWrong;
	
	public UserProfile deleteUser(long id) throws NotFoundException;
	
	public UserProfile updateUserProfile(long id ,UserProfile user);

	public UserProfile addToFollowing(long userID, long F_Id);
	
	public void removeFollowing(long userID, long F_Id);
	
	public Post addPost(Post post, long user_id);
	
	public void removePost(long id, long user_id);
	
	public Set<UserProfile> getUserFollowing(long id);
	
	public Set<UserProfile> getUserFollowers(long id);
	
	public Set<Post> userFeed(long id) throws NotFoundException;
	
	public List<Post> getUserPost(long id);
	
	public void userPostLike(long post_id, long user_id);
	
	public void postUnlike(long post_id, long user_id);
	
	public void userPostComment(long post_id, long user_id, String comment);
	
	public void userDeleteComment(Comment comment, long post_id);
	
	public void commentUnlike(long post_id, long user_id);
	
	public void userCommentLike(long post_id, Comment comment);
	
	public List<Map<String, Comment>> getPostComment(long post_id);
	
	public UserProfile findUserById(long id);
	
	public void changePassword(long user_id,String oldPassword, String newPassword) throws SomethingWentWrong;

	public void uploadImage(long userId, MultipartFile file) throws IOException;
	
	public List<Post> searchPost(String keyword);
	
	public List<UserProfile> SearchUser(String keyword);
	
	public Set<String> notification(long id);
}
