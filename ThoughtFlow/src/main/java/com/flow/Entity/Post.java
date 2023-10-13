package com.flow.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

@Entity
public class Post {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long Post_id;
	
	@NotNull
	private String title;
	
	@Lob
    @NotNull
    @Column(length = 2000) // Adjust the length according to your requirements
    private String tweet;
	
	private PostCategory category;
	
	private LocalDateTime date;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private UserProfile user;
	
	@Nullable
	@ElementCollection
	private List<PostLike> postLikes = new ArrayList<>();
	
	//has a relationship
	@Nullable 
	@ElementCollection
	private List<Comment> comments = new ArrayList<>();
	
	//Contructor and getter setters

	public Post() {
		super();
		// TODO Auto-generated constructor stub
	}

	//add and delete likes and comments
	public void addComment(Comment comment) {
        this.comments.add(comment);
    }

    public void removeComment(Comment comment) {
        this.comments.remove(comment);
    }
    
    public void addLike(PostLike postLike) {
    	this.postLikes.add(postLike);
    }
    
    public void removeLike(PostLike postLike) {
    	this.postLikes.remove(postLike);
    }
	
	public String getTweet() {
		return tweet;
	}

	public void setTweet(String tweet) {
		this.tweet = tweet;
	}

	public List<PostLike> getPostLikes() {
		return postLikes;
	}

	public void setPostLikes(List<PostLike> postLikes) {
		this.postLikes = postLikes;
	}

	public List<Comment> getComments() {
		return comments;
	}

	public void setComments(List<Comment> comment) {
		this.comments = comment;
	}

	public long getPost_id() {
		return Post_id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public PostCategory getCategory() {
		return category;
	}

	public void setCategory(PostCategory category) {
		this.category = category;
	}

	public UserProfile getUser() {
		return user;
	}

	public void setUser(UserProfile user) {
		this.user = user;
	}

	public LocalDateTime getDate() {
		return date;
	}

	public void setDate(LocalDateTime date) {
		this.date = date;
	}
	
}
