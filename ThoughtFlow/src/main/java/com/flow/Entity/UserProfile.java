package com.flow.Entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;

@Entity
public class UserProfile extends User {

	@Email
	private String email;
	
	@Nullable
	@JsonIgnore
	@ManyToMany
	private Set<UserProfile> followers = new HashSet<>();
	
	@Nullable
	@JsonIgnore
	@ManyToMany
	private Set<UserProfile> following = new HashSet<>();
	
    @JsonIgnore
	@OneToMany(mappedBy = "user")
	private List<Post> post = new ArrayList<>();
    
    @ElementCollection
    @MapKeyColumn(name = "category_key")
    @Column(name = "category_value")
    private Map<PostCategory,Integer> feedCategory = new HashMap<>();
    
    @Nullable
    private List<PostCategory> postCategory = new ArrayList<>();
    
    @Lob
    @Column(length = 3145728) // 3 * 1024 * 1024 bytes for 3 MB
    @Nullable
    private byte[] image;

	public UserProfile() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Set<UserProfile> getFollowers() {
		return followers;
	}

	public void setFollowers(Set<UserProfile> followers) {
		this.followers = followers;
	}

	public Set<UserProfile> getFollowing() {
		return following;
	}

	public void setFollowing(Set<UserProfile> following) {
		this.following = following;
	}

	public List<Post> getPost() {
		return post;
	}

	public void setPost(List<Post> post) {
		this.post = post;
	}

	public Map<PostCategory, Integer> getFeedCategory() {
		return feedCategory;
	}

	public void setFeedCategory(Map<PostCategory, Integer> feedCategory) {
		this.feedCategory = feedCategory;
	}

	public List<PostCategory> getPostCategory() {
		return postCategory;
	}

	public void setPostCategory(List<PostCategory> postCategory) {
		this.postCategory = postCategory;
	}

	public byte[] getImage() {
		return image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

}
